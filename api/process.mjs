const MAX_REQUEST_BYTES = 4_000_000;

const readBody = async (request) => {
  const chunks = [];
  let bytes = 0;

  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_REQUEST_BYTES) {
      const error = new Error("The upload is too large. Please use a file smaller than 3 MB.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
};

const sendJson = (response, status, body) => {
  response.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(body));
};

const extractJson = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  return JSON.parse(candidate);
};

const schemaInstructions = `Return ONLY valid JSON, without Markdown. Use this exact top-level schema:
{
  "format": "PDF" | "JSON" | "Email",
  "intent": "short intent label",
  "agentUsed": "PDF Agent" | "JSON Agent" | "Email Agent",
  "extractedData": { "agent": "same agent name", "summary": "concise summary", "keyData": {}, "anomalies": [], "metadata": {} }
}

For JSON: include validJson, fieldCount, extractedFields, and anomalies in extractedData.
For Email: include sender, subject, intent, urgency, keyEntities, and actionItems in extractedData.
For PDF: include pageCount when determinable, documentType, keyData, and metadata in extractedData.
Never invent values; use null, [] or {} when data is unavailable.`;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return sendJson(response, 503, { error: "Gemini is not configured. Add GEMINI_API_KEY in the deployment environment." });
  }

  try {
    const { fileName, mimeType, content, base64 } = await readBody(request);
    if (!fileName || (!content && !base64)) {
      return sendJson(response, 400, { error: "fileName and file content are required." });
    }

    const format = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")
      ? "PDF"
      : fileName.toLowerCase().endsWith(".json")
        ? "JSON"
        : "Email";
    const part = format === "PDF"
      ? { inline_data: { mime_type: "application/pdf", data: base64 } }
      : { text: String(content).slice(0, 250_000) };
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "You are a reliable multi-agent document processing system. " + schemaInstructions }] },
          contents: [{ role: "user", parts: [{ text: `Process this ${format} file named ${fileName}.` }, part] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      }
    );
    const payload = await geminiResponse.json();
    if (!geminiResponse.ok) {
      throw new Error(payload?.error?.message || "Gemini could not process this document.");
    }

    const generatedText = payload?.candidates?.[0]?.content?.parts?.map((item) => item.text || "").join("");
    const analysis = extractJson(generatedText);
    const timestamp = new Date().toISOString();
    return sendJson(response, 200, {
      id: crypto.randomUUID(),
      timestamp,
      format: analysis.format || format,
      intent: analysis.intent || "General Document",
      content: format === "PDF" ? `PDF upload: ${fileName}` : String(content).slice(0, 500),
      extractedData: analysis.extractedData || {},
      agentUsed: analysis.agentUsed || `${format} Agent`,
      status: "completed"
    });
  } catch (error) {
    console.error("Document processing failed", error);
    return sendJson(response, error.statusCode || 500, { error: error.message || "Document processing failed." });
  }
}

import { ProcessedDocument } from "@/pages/DocumentProcessor";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const readText = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsText(file);
});

const readBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(",")[1]);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

export const processDocument = async (file: File): Promise<ProcessedDocument> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Please use a file smaller than 3 MB.");
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      ...(isPdf ? { base64: await readBase64(file) } : { content: await readText(file) })
    })
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error || "Document processing failed.");
  }
  return body as ProcessedDocument;
};

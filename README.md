# Classifier Agent – Multi-Agent Document Processor

## 📌 Project Objective

The Classifier Agent is a multi-agent AI system designed to intelligently process and classify incoming documents in various formats—PDF, JSON, and Email (text). It detects both the format and intent of incoming data and dynamically routes it to the appropriate processing agent, maintaining shared context across the entire workflow for seamless data traceability and chaining.



## System Architecture

The system consists of three collaborative agents and a shared memory module:

### 1. 🤖 Classifier Agent
- **Input**: Raw PDF, Email, or JSON file.
- **Classifies**:
  - Format (PDF / JSON / Email)
  - Intent (Invoice, RFQ, Complaint, Regulation, etc.)
- **Functionality**:
  - Routes content to the appropriate specialized agent.
  - Logs classification details into shared memory.

### 2. 🧾 JSON Agent
- Handles structured **JSON** payloads.
- Extracts and reformats data into a target schema.
- Detects missing or anomalous fields.

### 3. 📧 Email Agent
- Processes email body content.
- Extracts:
  - Sender
  - Intent
  - Urgency
- Outputs data in CRM-ready format.

### 🧠 Shared Memory Module
- Lightweight module accessible by all agents.
- Stores:
  - Source type and timestamp
  - Extracted field values
  - Conversation or thread identifiers
- Supports SQLite.

## Folder Structure
Classifier Agent/
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (other UI components)
│   │   ├── AgentDashboard.tsx     # Agent status and metrics
│   │   ├── FileUpload.tsx         # Drag & drop file upload
│   │   ├── MemoryViewer.tsx       # Shared memory logs viewer
│   │   └── ProcessingFlow.tsx     # Visual workflow display
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── pages/
│   │   ├── DocumentProcessor.tsx  # Main application page
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── services/                  # AI Agent Services
│   │   ├── classifierAgent.ts     # Routes documents to agents
│   │   ├── emailAgent.ts          # Processes email content
│   │   ├── jsonAgent.ts           # Handles JSON validation
│   │   └── pdfAgent.ts            # Extracts PDF data
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts
├── .gitignore
├── README.md
├── bun.lockb
├── components.json                # Shadcn UI config
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts



## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Node.js 
- **AI/LLMs**: OpenAI 
- **Memory**: SQLite
- **Agent Architecture**: Modular and extensible

---

## 🖼️ Sample Output

### 🔹 Classifier Agent Log
```json
{
  "agent": "JSON Agent",
  "validJson": true,
  "fieldCount": 3,
  "extractedFields": {
    "name": "Integration Webhooks"
  },
  "anomalies": [
    "Missing required fields: id, timestamp"
  ],
  "timestamp": "2025-06-01T09:53:20.325Z"
}

```PDF
{
  "agent": "PDF Agent",
  "pageCount": 39,
  "extractedText": "%PDF-1.7\n%����\n\n1 0 obj\n<<\n/Creator <FEFF0045006E00680061006E00630076>\n/Producer <FEFF0045006E00680061006E006300760020002800680074007400700073003A002F002F007700770077002E0065006E00680061006E00630076002E0063006F006D0029>\n/CreationDate (D:20250403155115+00'00')\n/ModDate (D:20250403155116Z)\n/ecv-data <FEFF007B0022005F006900640022003A00220036003700650065006100630031006300380038003000310032003600650064006300390065003900350031006200390022002C0022007300740079006C00650022003A007B0022006C00610079006F0075007400530069007A00650022003A0022006D0065006400690075006D0022002C0022006200610063006B00670072006F0075006E00640022003A00220022002C00220063006F006C006F007200730022003A005B002200230030003000300030003000300022002C002200230030003000380043004600460022005D002C00220066006F006E00740042006F006400790022003A00220069006E007400650072007500690022002C00220066006F006E007400480065006100640069006E00670022003A00220072007500620069006B0022002C00220066006F006E007400530069007A00650022003A0031002C002200690073004D00650074...",
  "documentType": "General Document",
  "keyData": {
    "amounts": [
      "$5",
      "$5",
      "$2",
      "$5",
      "$0"
    ]
  },
  "metadata": {
    "hasImages": false,
    "hasTable": true,
    "wordCount": 7836
  },
  "timestamp": "2025-06-01T09:53:36.197Z"
}

```Email

{
  "agent": "Email Agent",
  "sender": "reply-to:subject:date:to:mime-version:content-type:content-transfer-encoding:list-unsubscribe:x-csa-complaints:list-unsubscribe-post:message-id:x-sib-id:feedback-id;",
  "subject": "date:to",
  "intent": "Acknowledgment",
  "urgency": "Low",
  "keyEntities": [
    "unnatisinghrajawat@gmail.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "unnatisinghrajawat@gmail.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "bounces-327292246-3596917957@gy.d.sender-sib.com",
    "unnatisinghrajawat@gmail.com",
    "202505302005.68430183737@smtp-relay.mailin.fr",
    "202505302005.68430183737@smtp-relay.mailin.fr",
    "unnatisinghrajawat@gmail.com",
    "unnatisinghrajawat@9173929.brevosend.com",
    "csa-complaints@eco.de",
    "1748635545",
    "3596917957",
    "3596917957",
    "3596917957",
    "3596917957",
    "3596917957",
    "3596917957"
  ],
  "actionItems": [],
  "timestamp": "2025-06-01T09:53:47.015Z"
}


## Getting Started

###  Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Go into the project directory
cd classifier-agent

# Install dependencies
npm install

# Start the development server
npm run dev
```

> Make sure you have **Node.js** and **npm** installed on your system.

---



##  Contact

For questions or suggestions, feel free to reach out at [unnatisinghrajawat@gmail.com]

---

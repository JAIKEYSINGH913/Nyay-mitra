# Nyay-Mitra: Legal AI Platform

Nyay-Mitra is a sovereign legal AI ecosystem designed to provide high-fidelity judicial telemetry, legal research automation, and statutory analysis. It features a "Sovereign Cockpit" industrial UI and a suite of high-performance microservices.

NyayMitra: Comprehensive Service Feature List
1. Nyay-Graph (The Precedent & Relationship Engine)
Focus: Data Mining, Graph Databases, and Visual Intelligence. 3D Interactive Precedent Map: A zoomable, force-directed graph (using D3.js) showing connections between cases. PageRank Influence Scoring: Mathematical ranking of cases based on citation authority, not just date. "Point-of-Law" Clustering: Automatic grouping of cases using Louvain algorithms (e.g., all "Land Acquisition" cases clustered together). Precedent Decay Tracker: Identifies cases whose influence is fading due to more recent, stronger judgments. Judicial Philosophy Mapping: Visualizing which precedents a specific judge favors to understand their "legal lens."

2. Nyay-Audit (The Drafting & Veracity Engine)
Focus: LLMs, GraphRAG, and Document Verification. Automatic "Fake Citation" Detection: Scans drafts and cross-references the Graph Database to flag non-existent or "hallucinated" cases. Outdated Law Scanner: Flags citations that have been overruled or weakened by more recent judgments. Rhetorical Role Labeling: Breaks down a judgment into Facts, Arguments, Statute, and Ruling for quick reading. Draft Consistency Checker: Compares your legal draft against high-quality templates to suggest professional phrasing. Smart Redlining: AI-driven suggestions for contract clauses to shift them from "Pro-Vendor" to "Pro-Client."

3. Nyay-Bridge (The Statutory Transition Engine)
Focus: Semantic Mapping and Compliance. IPC-to-BNS Mapping: Real-time lookup and side-by-side comparison of old IPC sections and new BNS sections. FIR/Charge-Sheet Auditor: Upload a document; it auto-converts all old section references (IPC/CrPC) to the new codes (BNS/BNSS). Punishment Delta Report: Highlighting exactly how penalties or jail terms have changed for specific offenses. Timeline Historical View: A slider to see the state of a law at different points in Indian history.

4. Nyay-Vani (The Multi-lingual Voice Engine)
Focus: NLP, Speech-to-Text, and Social Impact. Bhashini Integration: Real-time voice translation into 14+ Indian regional languages (Hindi, Tamil, etc.). Voice-to-Action: Allow rural users to state their problem (e.g., "My land was taken by a neighbor") and receive the relevant "Statute Node" from the graph. Legal "Radio" Mode: Audio-summaries of daily landmark judgments for lawyers on the go. Simplified Legal Chat: Converts complex "Legalese" into plain "Aam Aadmi" language via voice.

## 🚀 Project Structure

- **`frontend/`**: Next.js 15 based "Sovereign Cockpit" dashboard with Framer Motion and Three.js animations.
- **`backend/nyay-kernel/`**: Core Java/Spring Boot service for legal intelligence orchestration.
- **`backend/nyay-vani/`**: AI-powered voice and linguistic processing service (Python/FastAPI).
- **`backend/nyay-bridge/`**: IPC-to-BNS mapping and statutory bridge service (Python/FastAPI).
- **`backend/nyay-audit/`**: System integrity and judicial telemetry auditing service (Python/FastAPI).

---

## 🛠️ Prerequisites

Ensure you have the following installed:
- **Node.js 18+** & **npm**
- **Python 3.10+**
- **Java 17** & **Maven**
- **Infra (Local or Docker)**: Redis, RabbitMQ, Neo4j, Milvus.

---

## 🏃 Getting Started

### 1. Frontend Setup (Dashboard)
```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:3000`.

### 2. Core Kernel Setup (Java)
```bash
cd backend/nyay-kernel
mvn clean install
mvn spring-boot:run
```

### 3. AI Microservices (Python)

For each service (`nyay-vani`, `nyay-bridge`, `nyay-audit`):
```bash
cd backend/nyay-<service>
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port <PORT>
```
*Default Ports:*
- `nyay-vani`: 8000
- `nyay-bridge`: 8001
- `nyay-audit`: 8002

---

## 🐳 Docker Deployment

The ecosystem can be deployed using the Docker configurations:
```bash
cd backend
docker build -t nyay-backend .
```

---

## 🛡️ Security & Integrity
- **Sovereign Vault**: Environment variables are managed via decentralized `.env` configurations.
- **Telemetry Strip**: Real-time system health Monitoring.
- **Micro-animations**: Enhanced UX for deterministic AI states.

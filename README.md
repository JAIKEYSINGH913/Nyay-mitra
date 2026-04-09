# Nyay-Mitra: Legal AI Platform

Nyay-Mitra is a sovereign legal AI ecosystem designed to provide high-fidelity judicial telemetry, legal research automation, and statutory analysis. It features a "Sovereign Cockpit" industrial UI and a suite of high-performance microservices.

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

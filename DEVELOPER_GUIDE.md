
# NYAY-MITRA SOVEREIGN JUDICIAL ENGINE
## Complete Developer and Technical Reference Guide

Version: 1.0.0 | Status: Production
Live Frontend: https://nyay-mitra-rho.vercel.app
Live Backend: https://nyay-python-gateway.fly.dev
GitHub: https://github.com/JAIKEYSINGH913/Nyay-mitra

---

## TABLE OF CONTENTS
1. Project Overview and Aim
2. System Architecture
3. Full Technology Stack
4. Microservice Breakdown
5. Prerequisites
6. Local Installation Step by Step
7. Environment Variables Reference
8. API Endpoint Documentation
9. Authentication System
10. Database and External Services Setup
11. Deployment Guide
12. Project Structure
13. Troubleshooting and FAQs

---

## 1. PROJECT OVERVIEW AND AIM

Nyay-Mitra (meaning Friend of Justice in Hindi) is an AI-powered multilingual sovereign
judicial intelligence engine. It democratizes access to Indian legal knowledge by providing
real-time AI-assisted legal analysis, multilingual voice interaction, statutory mapping
between IPC and BNS, and forensic document verification.

Problem Statement:
Millions of Indian citizens are denied effective legal access due to:
- Language barriers: only 10 percent of India speaks English fluently
- Complexity of legal documents and statutes
- Lack of affordable legal consultation
- Confusion between old IPC laws and new BNS provisions (2023)
- No accessible interface to navigate Indian case law

Core Objectives:
1. Democratize Legal Access: Free legal guidance in 20 plus Indian languages
2. Modernize Statutory Navigation: Auto-map IPC sections to new BNS provisions
3. Forensic Verification: Detect AI hallucinations in legal documents
4. Knowledge Graph: Build a living interconnected legal knowledge graph using Neo4j
5. Multilingual Voice AI: Query the legal system in your native language by voice

Target Users:
- Citizens who need plain-language legal rights explanations
- Lawyers and advocates who need rapid case research
- Legal students exploring the knowledge graph
- NGOs and courts needing bulk document verification

---

## 2. SYSTEM ARCHITECTURE

User Browser or Mobile
  |
  HTTPS
  |
FRONTEND: Next.js 16 on Vercel CDN
  Pages: Home, Vani, Graph, Audit, Bridge, Profile
  Auth: Appwrite SDK with Email and OAuth
  |
  |-- REST API --> PYTHON UNIFIED GATEWAY on Fly.io
  |                 Nyay-Vani   at /api/vani
  |                 Nyay-Audit  at /api/audit
  |                 Nyay-Bridge at /api/bridge
  |                 Nyay-Graph  at /api/graph
  |
  |-- SDK -------> APPWRITE CLOUD BaaS
                   User Sessions and JWT
                   OAuth: Google and GitHub
                   User Profile Database

External Services:
  Neo4j Aura        Legal Knowledge Graph
  Zilliz Milvus     Vector Embeddings and Semantic Search
  Google Gemini Pro AI Legal Reasoning
  Sarvam AI         Indian Language Speech to Text

Java Kernel on Fly.io second VM:
  Spring Boot 3.3 orchestrator
  JWT Security Layer
  Neo4j OGM Object Graph Mapping
  Redis Caching
  Swagger UI Documentation

---

## 3. FULL TECHNOLOGY STACK

FRONTEND LAYER:
  Next.js 16.2.1          React SSR SSG Framework
  React 19.2.4            UI Component Library
  TypeScript 5.x          Type Safe JavaScript
  Framer Motion 12.x      Animations and Transitions
  Three.js 0.183.x        3D WebGL Rendering Engine
  react-three-fiber 9.x   React wrapper for Three.js
  react-three-drei 10.x   Three.js helper utilities
  react-force-graph-3d    Force-directed 3D graph visualization
  react-force-graph-2d    Force-directed 2D graph
  Lucide React 1.7.x      Icon Library
  Appwrite SDK 24.2.0     Auth and Database client
  react-hot-toast 2.6.x   Toast notifications
  next-themes 0.4.x       Dark and Light mode
  Tailwind CSS 4.x        Utility CSS Framework

PYTHON MICROSERVICES:
  Python 3.10 plus        Runtime language
  FastAPI                 High-performance async REST API
  Uvicorn                 ASGI web server
  Pydantic                Data validation and serialization
  google-generativeai     Gemini 1.5 Pro AI integration
  sentence-transformers   Text vector embeddings
  Neo4j Python Driver     Graph database driver
  PyMilvus                Vector database driver
  httpx                   Async HTTP client
  spaCy                   NLP for citation extraction
  python-jose             JWT token handling
  python-dotenv           Environment variable loading
  python-multipart        PDF file upload support

JAVA KERNEL:
  Java 17 LTS             Runtime
  Spring Boot 3.3.4       Application Framework
  Spring Security 6.x     JWT auth and route protection
  Spring Data Neo4j       Neo4j OGM graph mapper
  Spring WebFlux          Reactive async programming
  Spring Data Redis       Caching layer
  JJWT 0.11.5             JWT token generation
  SpringDoc OpenAPI 2.6.0 Swagger UI documentation
  Maven 3.9.x             Build and dependency tool

INFRASTRUCTURE:
  Vercel           Frontend hosting on global CDN
  Fly.io           Containerized Python and Java backends
  Neo4j Aura       Managed cloud graph database
  Zilliz Cloud     Managed Milvus vector database
  Appwrite Cloud   BaaS for auth and profiles
  Google Gemini    AI text reasoning
  Sarvam AI        Indian language speech to text
  Docker           Backend container packaging
  GitHub           Source code repository

---

## 4. MICROSERVICE BREAKDOWN

NYAY-VANI (Voice Intelligence Engine)
Local Port: 8003
API Prefix: /api/vani

Processing Pipeline:
1. User speaks or types a legal query in any Indian language
2. Voice audio encoded as base64 and sent to Sarvam AI for STT
3. Transcribed text translated to English using Gemini
4. English query embedded as 384-dimensional vector using sentence-transformers
5. Milvus vector store searched for relevant legal passages
6. Gemini 1.5 Pro generates a grounded legal answer
7. Answer translated back to user native language by Gemini
8. Bilingual response returned with telemetry data

Endpoints:
  POST /api/vani/stt    Converts base64 audio to text using Sarvam AI
  POST /api/vani/query  Full legal query pipeline with bilingual output

Request for STT:
  audio_content: base64 encoded audio string
  language_code: BCP47 code such as hi-IN, ta-IN, bn-IN

Request for Query:
  text: the legal question in any language
  language: BCP47 language code for response

Response for Query:
  output.english_answer: answer in English
  output.native_answer: answer in requested language


NYAY-AUDIT (Forensic Verification Engine)
Local Port: 8001
API Prefix: /api/audit

Processing Pipeline:
1. User submits legal text or uploads PDF document
2. spaCy NLP extracts all legal citations from the document
3. Citations include case names, IPC sections, constitutional articles
4. Each citation verified against Neo4j legal knowledge graph
5. Gemini cross-checks citations for contextual and semantic accuracy
6. Veracity Score 0 to 100 percent returned with flagged hallucinations list

Endpoints:
  POST /api/audit/verify      Verify legal text for citation accuracy
  POST /api/audit/upload-pdf  Upload and audit an entire PDF document


NYAY-BRIDGE (Statutory Mapping Engine)
Local Port: 8002
API Prefix: /api/bridge

Purpose: Maps legacy IPC sections to new BNS provisions with punishment delta analysis

Key Mappings:
  IPC 302 Murder      maps to BNS 101
  IPC 420 Cheating    maps to BNS 318
  IPC 376 Rape        maps to BNS 64
  IPC 499 Defamation  maps to BNS 356

Endpoints:
  POST /api/bridge/map  Map any IPC section number to its BNS equivalent


NYAY-GRAPH (Neural Knowledge Graph)
Local Port: 8004
API Prefix: /api/graph

Data Model:
  Node Types: Statute, Case, Article, Judge, Court, Party, Concept
  Relationship Types: CITES, CONTRADICTS, APPLIES_TO, OVERRULED_BY, AMENDED_BY
  Visualization: 3D force-directed graph using Three.js and WebGL

Endpoints:
  GET /api/graph/data              All nodes and edges in the graph
  GET /api/graph/search            Semantic search through nodes
  GET /api/graph/advisory/node_id  AI advisory for a specific node
  GET /api/graph/check             Neo4j connectivity health check


NYAY-KERNEL (Java Orchestration Engine)
Port: 8080 as standalone

Responsibilities:
  JWT token generation and inter-service authentication
  Complex Neo4j graph operations via Spring Data OGM
  Redis caching for frequent legal queries providing 10x speed improvement
  Orchestration of multi-step legal reasoning workflows
  Auto-generated Swagger UI API documentation at /swagger-ui.html

---

## 5. PREREQUISITES

Install the following tools before setting up Nyay-Mitra locally:

  Node.js 18.x or 20.x LTS   https://nodejs.org
  Python 3.10 or 3.11        https://python.org
  Java JDK 17 LTS            https://adoptium.net
  Maven 3.9.x                https://maven.apache.org
  Git Latest                 https://git-scm.com
  Docker optional            https://docker.com

External Service Accounts (all have free tiers):
  Appwrite Cloud    https://cloud.appwrite.io
  Neo4j Aura Free  https://neo4j.com/cloud/aura-free
  Zilliz Cloud      https://cloud.zilliz.com
  Google AI Studio  https://aistudio.google.com
  Sarvam AI         https://sarvam.ai

---

## 6. LOCAL INSTALLATION STEP BY STEP

Step 1: Clone Repository
  git clone https://github.com/JAIKEYSINGH913/Nyay-mitra.git
  cd Nyay-mitra

Step 2: Configure Environment Variables
  copy .env.example .env
  Open .env and fill in all values as described in Section 7

Step 3: Install and Run the Frontend
  cd frontend
  npm install
  npm run dev
  Frontend available at http://localhost:3000

Step 4A: Run Unified Python Gateway (Recommended)
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --port 8080 --reload
  All microservices available at http://localhost:8080

Step 4B: Run Each Microservice Separately (Advanced)
  Open four separate terminal windows:

  Terminal 1 Nyay-Audit port 8001:
    cd backend/nyay-audit
    pip install -r requirements.txt
    uvicorn app.main:app --port 8001 --reload

  Terminal 2 Nyay-Bridge port 8002:
    cd backend/nyay-bridge
    pip install -r requirements.txt
    uvicorn app.main:app --port 8002 --reload

  Terminal 3 Nyay-Vani port 8003:
    cd backend/nyay-vani
    pip install -r requirements.txt
    uvicorn app.main:app --port 8003 --reload

  Terminal 4 Nyay-Graph port 8004:
    cd backend/nyay-graph
    pip install -r requirements.txt
    uvicorn app.main:app --port 8004 --reload

Step 5: Run the Java Kernel
  cd backend/nyay-kernel
  mvn clean install -DskipTests
  mvn spring-boot:run
  Swagger UI at http://localhost:8080/swagger-ui.html

Step 6: One-Click Windows Launcher
  From the project root directory run:
  .\launch_nyay.ps1
  OR
  run_nyay.bat

---

## 7. ENVIRONMENT VARIABLES REFERENCE

Create a file named .env in the project root with the following content:

  NEO4J_URI=neo4j+s://xxxxxxxx.databases.neo4j.io
  NEO4J_USER=neo4j
  NEO4J_PASSWORD=your_neo4j_password
  NEO4J_DATABASE=neo4j
  NEO4J_API_KEY=your_neo4j_api_key

  NEO4J_AUDIT_DB_URI=neo4j+s://audit.databases.neo4j.io
  NEO4J_AUDIT_DB_USER=neo4j
  NEO4J_AUDIT_DB_PASSWORD=your_audit_db_password

  MILVUS_URI=https://your-cluster.serverless.zilliz.com
  MILVUS_TOKEN=your_milvus_api_token

  GOOGLE_API_KEY=your_google_gemini_api_key
  SARVAM_API_KEY=your_sarvam_ai_api_key

  NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
  NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id

How to Get Each API Key:

Google Gemini API Key:
  1. Visit https://aistudio.google.com/app/apikey
  2. Click Create API Key
  3. Copy the key into GOOGLE_API_KEY

Sarvam AI Key:
  1. Visit https://sarvam.ai and create an account
  2. Navigate to API Keys section
  3. Click Generate and copy into SARVAM_API_KEY

Neo4j Aura:
  1. Visit https://neo4j.com/cloud/aura-free
  2. Create a free AuraDB Free instance
  3. IMPORTANT: Download the credentials file at creation time
     This is the only time you can see the generated password
  4. Copy URI, username, and password into the .env file

Zilliz Milvus:
  1. Visit https://cloud.zilliz.com
  2. Create a free Serverless cluster in nearest region
  3. Open cluster details page
  4. Copy Public Endpoint into MILVUS_URI
  5. Copy API Key into MILVUS_TOKEN

Appwrite:
  1. Visit https://cloud.appwrite.io and create an account
  2. Create a new project and give it a name
  3. Go to Project Settings to find the Project ID
  4. Copy Project ID into NEXT_PUBLIC_APPWRITE_PROJECT_ID
  5. The endpoint is always https://fra.cloud.appwrite.io/v1 for Frankfurt region

---

## 8. API ENDPOINT DOCUMENTATION

Base URLs:
  Local:      http://localhost:8080
  Production: https://nyay-python-gateway.fly.dev
  Swagger UI: https://nyay-python-gateway.fly.dev/docs

HEALTH CHECK:
  GET /health
  Returns: status UP, service name, list of loaded modules

NYAY-VANI ENDPOINTS:
  POST /api/vani/stt
  Body: audio_content as base64 string, language_code such as hi-IN
  Returns: transcription text and telemetry including accuracy and engine used

  POST /api/vani/query
  Body: text as the legal question, language as BCP47 code
  Returns: english_answer and native_answer both as strings

NYAY-AUDIT ENDPOINTS:
  POST /api/audit/verify
  Body: text as the legal document content to verify
  Returns: veracity_score as float, hallucinations as list, verified_citations as list

  POST /api/audit/upload-pdf
  Body: multipart form data with a file field containing the PDF
  Returns: veracity_score, flagged_sections with line numbers

NYAY-BRIDGE ENDPOINTS:
  POST /api/bridge/map
  Body: ipc_section as string such as 302, context as optional string
  Returns: ipc object with section and title, bns object with section and punishment_delta

NYAY-GRAPH ENDPOINTS:
  GET /api/graph/data
  Returns: nodes array and links array for rendering the full graph

  GET /api/graph/search with query parameter q
  Returns: filtered nodes and links matching the semantic search

  GET /api/graph/advisory with path parameter node_id
  Returns: AI-generated legal advisory for the specific graph node

  GET /api/graph/check
  Returns: neo4j_status as connected or disconnected

---

## 9. AUTHENTICATION SYSTEM

Nyay-Mitra uses Appwrite Cloud as its Backend as a Service for all authentication.
No custom authentication server needs to be built or maintained.

Email and Password Flow:
  1. User clicks the Profile icon in the top right corner of the navigation bar
  2. AuthModal component opens with a glassmorphic overlay
  3. User fills in their email, password and solves the math captcha
  4. Appwrite SDK calls createEmailPasswordSession method
  5. Session token is stored securely in browser cookies
  6. User is automatically redirected to the profile dashboard page

OAuth Flow for Google or GitHub:
  1. User clicks the Google or GitHub button in the AuthModal
  2. Appwrite SDK calls createOAuth2Session with the provider name
  3. Browser redirects to the provider consent screen
  4. After user approves, browser redirects to /auth-callback page
  5. The auth-callback page calls account.get to confirm session
  6. User is then redirected to the profile dashboard

Appwrite Project Setup Steps:
  1. Go to https://cloud.appwrite.io and create a new project
  2. Go to Auth then Settings and enable Email and Password provider
  3. Go to Auth then Providers and enable Google OAuth
     You will need a Google Cloud OAuth 2.0 Client ID and Client Secret
     Add the Appwrite redirect URI to Google Cloud Console authorized URIs
  4. Go to Auth then Providers and enable GitHub OAuth
     You will need a GitHub OAuth App Client ID and Client Secret
     Add the Appwrite callback URL to GitHub Developer Settings
  5. Go to Databases and create a new database
  6. Inside the database create a collection named profiles
  7. Add the following attributes to the profiles collection:
     fullName    as string with max size 255
     username    as string with max size 100
     phone       as string with max size 20
     dob         as string with max size 20
     email       as string with max size 255
     isProfileComplete as boolean
  8. Go to the project Overview page and scroll to Platforms section
  9. Click Add Platform then select Web App
  10. For local development set Hostname to localhost
  11. For production set Hostname to nyay-mitra-rho.vercel.app

---

## 10. DATABASE AND EXTERNAL SERVICES SETUP

Neo4j Aura Legal Knowledge Graph:
  1. Visit https://neo4j.com/cloud/aura-free
  2. Sign in and create a new AuraDB Free instance
  3. Choose the closest region to your users
  4. When the instance is created download the credentials text file immediately
     The password is shown only once at creation time
  5. Copy the URI, username, and password into your .env file
  6. To verify connection run: python scripts/neo4j_driver.py

Graph Data Model:
  Nodes: Statute, Case, Article, Judge, Court, Party
  Relationships: CITES, CONTRADICTS, APPLIES_TO, OVERRULED_BY, AMENDED_BY

Zilliz Cloud Milvus Vector Store:
  1. Visit https://cloud.zilliz.com and create an account
  2. Create a new free Serverless cluster
  3. Select the AWS region closest to your users
  4. Wait for cluster to become active
  5. Open the cluster and copy Public Endpoint into MILVUS_URI
  6. Copy the API Key into MILVUS_TOKEN
  7. Collections are auto-created by microservices on first startup
  8. Embedding model used is sentence-transformers all-MiniLM-L6-v2 with 384 dimensions

---

## 11. DEPLOYMENT GUIDE

FRONTEND DEPLOYMENT TO VERCEL:
  1. Ensure all code is pushed to the GitHub main branch
  2. Go to https://vercel.com and log in with GitHub
  3. Click New Project and then Import Git Repository
  4. Select the Nyay-mitra repository
  5. Set Root Directory to frontend in the configuration
  6. Vercel auto-detects Next.js and sets correct build commands
  7. Click Deploy and wait for build to complete
  8. After deploy go to Settings then Environment Variables
  9. Add NEXT_PUBLIC_APPWRITE_ENDPOINT with value https://fra.cloud.appwrite.io/v1
  10. Add NEXT_PUBLIC_APPWRITE_PROJECT_ID with your project ID value
  11. Go to Deployments tab and click Redeploy to apply environment variables
  12. Your site is live at the URL shown in the Vercel dashboard

PYTHON BACKEND DEPLOYMENT TO FLY.IO:
  Step 1: Install Fly CLI on Windows PowerShell as Administrator:
    Run this command: iwr https://fly.io/install.ps1 -useb | iex
    Restart PowerShell after installation

  Step 2: Log in to Fly.io:
    Run: fly auth login
    A browser window will open asking you to authorize

  Step 3: Launch the app from the backend folder:
    cd backend
    fly launch
    When prompted answer as follows:
      App name: nyay-python-gateway
      Region: bom for Mumbai or sin for Singapore
      VM Size: shared-cpu-1x
      RAM: 256MB
      Decline ALL add-ons: say NO to Postgres, Redis, Tigris, and Sentry
      Confirm settings and then type y to deploy

  Step 4: Set secret environment variables securely:
    fly secrets set NEO4J_URI=your_uri NEO4J_PASSWORD=your_pass
    fly secrets set GOOGLE_API_KEY=your_key SARVAM_API_KEY=your_key
    fly secrets set MILVUS_URI=your_uri MILVUS_TOKEN=your_token

  Step 5: Verify the deployment:
    Visit https://nyay-python-gateway.fly.dev/health
    You should see status UP with all four modules listed

JAVA KERNEL DEPLOYMENT TO FLY.IO SECOND VM:
  cd backend/nyay-kernel
  fly launch
  App name: nyay-java-kernel
  VM Size: shared-cpu-1x
  RAM: 512MB recommended for JVM

---

## 12. PROJECT STRUCTURE

Nyay-mitra root directory:
  .env                        Secret environment variables - NEVER commit this file
  .env.example                Template with placeholder values - safe to commit
  .gitignore                  Files excluded from version control
  DEVELOPER_GUIDE.md          This comprehensive developer guide
  launch_nyay.ps1             Windows PowerShell one-click launcher script
  run_nyay.bat                Windows batch file launcher

frontend directory (Next.js Application):
  app/page.tsx                Homepage and landing page with hero animations
  app/layout.tsx              Root layout with SEO metadata and fonts
  app/globals.css             Global CSS design tokens and base styles
  app/icon.svg                Custom browser tab favicon
  app/robots.ts               SEO robots configuration
  app/sitemap.ts              Dynamic SEO sitemap generator
  app/profile/page.tsx        Authenticated user profile dashboard
  app/nyay-vani/page.tsx      Multilingual voice AI interface
  app/nyay-graph/page.tsx     3D legal knowledge graph viewer
  app/nyay-audit/page.tsx     Document forensics and verification interface
  app/nyay-bridge/page.tsx    IPC to BNS statutory mapping interface
  app/research-hub/page.tsx   Legal research and document section
  app/auth-callback/page.tsx  OAuth redirect handler and session confirmer
  app/about/page.tsx          About Nyay-Mitra page
  app/help/page.tsx           Help and documentation page
  app/history/page.tsx        User query history page

  components/AuthModal.tsx        Login and registration modal with OAuth
  components/JusticeLogo.tsx      SVG brand logo component
  components/LoadingScreen.tsx    Animated loading overlay
  components/CookieConsent.tsx    GDPR cookie consent banner

  config/apiConfig.ts         Centralized API URL configuration
  lib/appwrite.ts             Appwrite SDK initialization and exports
  public/                     Static assets and workflow images

backend directory:
  main.py                     Unified FastAPI Gateway merging all services
  Dockerfile                  Docker container definition for Fly.io
  fly.toml                    Fly.io deployment configuration
  requirements.txt            Consolidated Python dependencies

  nyay-vani/app/main.py       Voice Intelligence microservice
  nyay-audit/app/main.py      Forensic Verification microservice
  nyay-bridge/app/main.py     Statutory Mapping microservice
  nyay-graph/app/main.py      Knowledge Graph microservice

  nyay-kernel/pom.xml         Maven dependencies for Java kernel
  nyay-kernel/src/main/java/com/nyaymitra/  Java Spring Boot source code

scripts directory:
  initialize_appwrite.py      Sets up Appwrite database schema
  neo4j_driver.py             Neo4j utility functions and test connection

---

## 13. TROUBLESHOOTING AND FAQS

Problem: Frontend shows cannot connect to backend error
Solution: Visit https://nyay-python-gateway.fly.dev/health to check if backend is up
  If down run: fly apps restart nyay-python-gateway
  Check Fly.io dashboard for any crashed machines

Problem: OAuth login fails or redirects to wrong URL
Solution: In Appwrite Console go to Platforms and ensure both hostnames are added:
  localhost for local development testing
  nyay-mitra-rho.vercel.app for production
  Also verify your OAuth provider callback URLs match the Appwrite-provided redirect URI

Problem: Neo4j connection fails at startup
Solution: Ensure NEO4J_URI starts with neo4j+s:// prefix not bolt:// for cloud connections
  Check your AuraDB instance is active at https://console.neo4j.io
  Verify the password is correct from your downloaded credentials file

Problem: Python module not found error
Solution: Run pip install -r requirements.txt inside the SPECIFIC microservice folder
  Do not run it only in the root backend folder if running services individually

Problem: Java Kernel fails to start
Solution: Verify Java 17 is installed by running: java -version
  Verify Maven is installed by running: mvn -version
  Ensure all Spring Boot environment variables are properly set

Problem: TypeScript build errors prevent Vercel deployment
Solution: Run npm run build inside the frontend folder locally
  Fix all type errors reported before pushing to GitHub
  Common fix: add explicit type annotations to function parameters

Problem: Sarvam AI returns empty transcription
Solution: Audio must be encoded in 16kHz WAV format
  Verify SARVAM_API_KEY is active in the Sarvam AI dashboard
  Check that audio duration is between 1 and 60 seconds

Problem: fly command not found after installation
Solution: Restart PowerShell completely after running the Fly CLI installer
  Run fly version to confirm installation was successful

Problem: Milvus vector search returns no results
Solution: The vector collections need to be populated first
  Run the initialization scripts in the scripts folder
  Check MILVUS_TOKEN has not expired in the Zilliz dashboard

---

Nyay-Mitra Sovereign Judicial Engine
Democratizing Access to Indian Legal Justice through Artificial Intelligence
Built by Jaikey Singh in 2025
Live at https://nyay-mitra-rho.vercel.app
All Rights Reserved

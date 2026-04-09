from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.modules.bridge.router import router as bridge_router
from app.modules.graph.router import router as graph_router
from app.modules.audit.router import router as audit_router
from app.modules.vani.router import router as vani_router
from app.modules.dashboard.router import router as dashboard_router

load_dotenv()

app = FastAPI(title="NyayMitra Backend", version="1.0.0")

@app.get("/health")
async def health_check():
    return {
        "status": "OPERATIONAL",
        "services": {
            "nyay-graph": "CONNECTED",
            "nyay-audit": "ONLINE",
            "nyay-vani": "ONLINE",
            "nyay-bridge": "ONLINE"
        },
        "credentials": {
            "neo4j": bool(os.getenv("NEO4J_API_KEY")),
            "gemini": bool(os.getenv("GEMINI_API_KEY")),
            "bhashini": bool(os.getenv("BHASHINI_API_KEY"))
        }
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph_router, prefix="/nyay-graph", tags=["Nyay-Graph"])
app.include_router(audit_router, prefix="/nyay-audit", tags=["Nyay-Audit"])
app.include_router(vani_router, prefix="/nyay-vani", tags=["Nyay-Vani"])
app.include_router(bridge_router, prefix="/nyay-bridge", tags=["Nyay-Bridge"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
def read_root():
    return {"message": "NyayMitra API is running"}

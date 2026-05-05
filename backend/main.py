import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import microservice applications
try:
    from nyay_vani.app.main import app as vani_app
    from nyay_audit.app.main import app as audit_app
    from nyay_bridge.app.main import app as bridge_app
    from nyay_graph.app.main import app as graph_app
except ImportError as e:
    print(f"Error importing microservices: {e}")
    sys.exit(1)

# Initialize Unified Gateway
app = FastAPI(
    title="Nyay-Mitra Unified API Gateway",
    description="Consolidated backend for production deployment",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dynamically merge all routes from microservices into the Unified Gateway
app.router.routes.extend(vani_app.router.routes)
app.router.routes.extend(audit_app.router.routes)
app.router.routes.extend(bridge_app.router.routes)
app.router.routes.extend(graph_app.router.routes)

@app.get("/health")
def health_check():
    return {
        "status": "UP", 
        "service": "Nyay-Mitra Unified Gateway",
        "modules_loaded": ["Vani", "Audit", "Bridge", "Graph"]
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting Nyay-Mitra Unified Gateway on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)

from pydantic import BaseModel
from typing import List, Optional

class SectionCreate(BaseModel):
    section_id: str
    title: str
    description: str
    statute: str  # IPC or BNS

class CaseCreate(BaseModel):
    case_id: str
    title: str
    summary: str
    date: str

class EntityCreate(BaseModel):
    name: str
    type: str  # Person, Location, etc.

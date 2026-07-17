from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid
import httpx
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

from app.database import get_db
from app.schemas.lead import LeadCreate, LeadResponse
from app.models.lead import Lead
from app.models.user import User
from app.core.security import get_current_admin
from app.core.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

async def send_whatsapp_welcome(name: str, mobile_number: str):
    """
    Sends a request to the Node.js WhatsApp microservice to dispatch a welcome message.
    Includes API key for authentication.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:3000/send-welcome",
                json={"name": name, "mobile_number": mobile_number},
                headers={"X-API-Key": settings.WHATSAPP_BOT_API_KEY},
                timeout=10.0
            )
            response.raise_for_status()
            logger.info(f"Successfully triggered WhatsApp welcome for {mobile_number}")
    except Exception as e:
        logger.error(f"Failed to send WhatsApp welcome to {mobile_number}: {e}")

@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def create_lead(request: Request, lead_in: LeadCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """
    Register a new lead for consultation. (Public endpoint — rate limited)
    """
    if not lead_in.consent_given:
        raise HTTPException(status_code=400, detail="Consent is required")
        
    mock_lead = Lead(
        id=uuid.uuid4(),
        name=lead_in.name,
        email=lead_in.email,
        mobile_number=lead_in.mobile_number,
        consent_given=lead_in.consent_given,
        call_status="new",
        notes=None,
    )
    db.add(mock_lead)
    await db.commit()
    await db.refresh(mock_lead)
    
    # Trigger the automated WhatsApp message in the background
    background_tasks.add_task(send_whatsapp_welcome, mock_lead.name, mock_lead.mobile_number)
    
    return mock_lead

@router.get("/", response_model=List[LeadResponse])
async def get_leads(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Retrieve leads (Admin only).
    """
    from sqlalchemy import select
    result = await db.execute(select(Lead).order_by(Lead.created_at.desc()).offset(skip).limit(limit))
    return result.scalars().all()


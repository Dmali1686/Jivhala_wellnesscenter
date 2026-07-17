from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.database import get_db
from app.models.vlog import Vlog
from app.models.user import User
from app.schemas.vlog import VlogCreate, VlogResponse
from app.core.security import get_current_admin

router = APIRouter()

@router.post("/", response_model=VlogResponse, status_code=status.HTTP_201_CREATED)
async def create_vlog(
    vlog_in: VlogCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Create a new vlog entry. (Admin only)
    """
    new_vlog = Vlog(
        id=uuid.uuid4(),
        **vlog_in.model_dump()
    )
    db.add(new_vlog)
    await db.commit()
    await db.refresh(new_vlog)
    return new_vlog

@router.get("/", response_model=List[VlogResponse])
async def get_vlogs(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all vlogs, ordered by newest first. (Public)
    """
    result = await db.execute(select(Vlog).order_by(Vlog.created_at.desc()))
    return result.scalars().all()

@router.delete("/{vlog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_vlog(
    vlog_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Delete a vlog entry. (Admin only)
    """
    result = await db.execute(select(Vlog).filter(Vlog.id == vlog_id))
    vlog = result.scalars().first()
    
    if not vlog:
        raise HTTPException(status_code=404, detail="Vlog not found")
        
    await db.delete(vlog)
    await db.commit()
    return None


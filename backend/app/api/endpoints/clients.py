from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import date

from app.database import get_db
from app.models.user import User
from app.models.progress import ProgressLog
from app.schemas.user import UserCreate, UserResponse, UserBase
from app.schemas.progress import ProgressLogCreate, ProgressLogResponse
from app.core.security import get_password_hash

# TODO: Add dependency to verify admin/client JWT token
router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Admin endpoint to create a new client with mobile number and password."""
    # Check if mobile exists
    result = await db.execute(select(User).where(User.mobile_number == client_in.mobile_number))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Mobile number already registered")
        
    hashed_password = get_password_hash(client_in.password)
    new_user = User(
        mobile_number=client_in.mobile_number,
        password_hash=hashed_password,
        role="client",
        height=client_in.height,
        target_weight=client_in.target_weight,
        username=client_in.username
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserResponse)
async def get_my_dashboard(mobile_number: str, db: AsyncSession = Depends(get_db)):
    """Get dashboard info for logged in client. Note: mobile_number should come from JWT token."""
    result = await db.execute(select(User).where(User.mobile_number == mobile_number))
    user = result.scalars().first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/me/progress", response_model=ProgressLogResponse)
async def log_progress(mobile_number: str, log_in: ProgressLogCreate, db: AsyncSession = Depends(get_db)):
    """Log daily weight. mobile_number should come from JWT token."""
    result = await db.execute(select(User).where(User.mobile_number == mobile_number))
    user = result.scalars().first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
         
    new_log = ProgressLog(
        user_id=user.id,
        weight=log_in.weight,
        date=log_in.date or date.today()
    )
    
    # Update streak
    user.streak += 1
    
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/me/progress", response_model=List[ProgressLogResponse])
async def get_progress(mobile_number: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.mobile_number == mobile_number))
    user = result.scalars().first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
         
    logs = await db.execute(select(ProgressLog).where(ProgressLog.user_id == user.id).order_by(ProgressLog.date.asc()))
    return logs.scalars().all()

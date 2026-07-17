from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import date

from app.database import get_db
from app.models.user import User
from app.models.progress import ProgressLog
from app.schemas.user import UserCreate, UserResponse, UserBase, UserUpdate, PasswordUpdate
from app.schemas.progress import ProgressLogCreate, ProgressLogResponse
from app.core.security import get_password_hash, get_current_user, get_current_admin, verify_password

router = APIRouter()

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
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
async def get_my_dashboard(
    current_user: User = Depends(get_current_user),
):
    """Get dashboard info for the logged-in client."""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_my_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the authenticated client's profile (name, height, target weight)."""
    if updates.username is not None:
        current_user.username = updates.username
    if updates.height is not None:
        current_user.height = updates.height
    if updates.target_weight is not None:
        current_user.target_weight = updates.target_weight
    
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.put("/me/password")
async def change_password(
    passwords: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change the authenticated client's password. Requires old password verification."""
    if not verify_password(passwords.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    if len(passwords.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    
    current_user.password_hash = get_password_hash(passwords.new_password)
    await db.commit()
    return {"message": "Password updated successfully"}

@router.post("/me/progress", response_model=ProgressLogResponse)
async def log_progress(
    log_in: ProgressLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Log daily weight for the authenticated client."""
    new_log = ProgressLog(
        user_id=current_user.id,
        weight=log_in.weight,
        date=log_in.date or date.today()
    )
    
    # Update streak
    current_user.streak += 1
    
    db.add(new_log)
    await db.commit()
    await db.refresh(new_log)
    return new_log

@router.get("/me/progress", response_model=List[ProgressLogResponse])
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get weight history for the authenticated client."""
    logs = await db.execute(
        select(ProgressLog)
        .where(ProgressLog.user_id == current_user.id)
        .order_by(ProgressLog.date.asc())
    )
    return logs.scalars().all()


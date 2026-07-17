from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.schemas.user import Token

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class LoginRequest(BaseModel):
    mobile_number: str
    password: str

@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
async def login(request: Request, login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Authenticate a user and return a JWT token. Rate limited to 5 requests/minute per IP.
    """
    result = await db.execute(select(User).where(User.mobile_number == login_data.mobile_number))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect mobile number or password")
    
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect mobile number or password")
    
    access_token = create_access_token(subject=user.mobile_number)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role
    }


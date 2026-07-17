from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import os
import aiofiles

from app.database import get_db
from app.models.success_story import SuccessStory
from app.models.user import User
from app.schemas.success_story import SuccessStoryCreate, SuccessStoryResponse
from app.core.security import get_current_admin

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# File upload security constraints
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

@router.post("/upload-image/")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Upload an image for a success story. (Admin only)
    Validates file type and size.
    """
    # Validate content type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}"
        )
    
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension '{file_extension}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    try:
        # Read content and validate size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)} MB"
            )
        
        # Generate unique filename with validated extension
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(content)
            
        return {"url": f"/{file_path}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.post("/", response_model=SuccessStoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(
    story_in: SuccessStoryCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Create a new success story. (Admin only)
    """
    new_story = SuccessStory(
        id=uuid.uuid4(),
        **story_in.model_dump()
    )
    db.add(new_story)
    await db.commit()
    await db.refresh(new_story)
    return new_story

@router.get("/", response_model=List[SuccessStoryResponse])
async def get_stories(db: AsyncSession = Depends(get_db)):
    """
    Retrieve all success stories. (Public)
    """
    result = await db.execute(select(SuccessStory).order_by(SuccessStory.created_at.desc()))
    return result.scalars().all()

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),  # Admin-only
):
    """
    Delete a success story. (Admin only)
    """
    result = await db.execute(select(SuccessStory).filter(SuccessStory.id == story_id))
    story = result.scalars().first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
        
    await db.delete(story)
    await db.commit()
    return None


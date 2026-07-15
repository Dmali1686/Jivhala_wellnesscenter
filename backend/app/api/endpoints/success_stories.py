from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import os
import aiofiles

from app.database import get_db
from app.models.success_story import SuccessStory
from app.schemas.success_story import SuccessStoryCreate, SuccessStoryResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image for a success story.
    Returns the file path to be stored in the database.
    """
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
            
        return {"url": f"/{file_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@router.post("/", response_model=SuccessStoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(story_in: SuccessStoryCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new success story.
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
    Retrieve all success stories.
    """
    result = await db.execute(select(SuccessStory).order_by(SuccessStory.created_at.desc()))
    return result.scalars().all()

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(story_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Delete a success story.
    """
    result = await db.execute(select(SuccessStory).filter(SuccessStory.id == story_id))
    story = result.scalars().first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
        
    await db.delete(story)
    await db.commit()
    return None

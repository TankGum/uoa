from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import Media
from schemas import Media as MediaSchema, MediaCreate

router = APIRouter(prefix="/api/media", tags=["media"])


@router.post("", response_model=MediaSchema, status_code=status.HTTP_201_CREATED)
def create_media(media: MediaCreate, db: Session = Depends(get_db)):
    db_media = Media(**media.dict())
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media


# Note: This endpoint is handled in posts router to maintain /api/posts/{post_id}/media path


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(media_id: uuid.UUID, db: Session = Depends(get_db)):
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if not db_media:
        raise HTTPException(status_code=404, detail="Media not found")
    db.delete(db_media)
    db.commit()
    return None


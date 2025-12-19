from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import tempfile
import os

from services.cloudinary_service import upload_video
from routers.auth import get_current_user_dependency

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("/video")
async def upload_video_endpoint(
    file: UploadFile = File(...),
    folder: Optional[str] = None,
    current_user: str = Depends(get_current_user_dependency)
):
    """
    Upload video file to Cloudinary
    Returns Cloudinary metadata for frontend to use when creating post
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a video"
        )
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
        try:
            # Write file content
            content = await file.read()
            tmp_file.write(content)
            tmp_file.flush()
            
            # Upload to Cloudinary
            result = upload_video(tmp_file.name, folder=folder)
            
            return JSONResponse(content={
                "success": True,
                "data": {
                    "public_id": result["public_id"],
                    "secure_url": result["secure_url"],
                    "duration": result["duration"],
                    "width": result["width"],
                    "height": result["height"],
                    "format": result["format"],
                    "size": result["bytes"]
                }
            })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}"
            )
        finally:
            # Clean up temp file
            if os.path.exists(tmp_file.name):
                os.unlink(tmp_file.name)


@router.post("/image")
async def upload_image_endpoint(
    file: UploadFile = File(...),
    folder: Optional[str] = None,
    current_user: str = Depends(get_current_user_dependency)
):
    """
    Upload image file to Cloudinary
    Returns Cloudinary metadata for frontend to use when creating post
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
        try:
            # Write file content
            content = await file.read()
            tmp_file.write(content)
            tmp_file.flush()
            
            # Upload to Cloudinary
            result = upload_video(tmp_file.name, folder=folder, resource_type="image")
            
            return JSONResponse(content={
                "success": True,
                "data": {
                    "public_id": result["public_id"],
                    "secure_url": result["secure_url"],
                    "duration": result.get("duration"),  # None for images
                    "width": result["width"],
                    "height": result["height"],
                    "format": result["format"],
                    "size": result["bytes"]
                }
            })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Upload failed: {str(e)}"
            )
        finally:
            # Clean up temp file
            if os.path.exists(tmp_file.name):
                os.unlink(tmp_file.name)


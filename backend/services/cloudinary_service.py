import cloudinary
import cloudinary.uploader
import cloudinary.api
from typing import Optional, Dict, List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if exists
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

# Also try loading from parent directory (project root)
parent_env_path = Path(__file__).parent.parent.parent / '.env'
if parent_env_path.exists():
    load_dotenv(parent_env_path)

# Initialize Cloudinary function (called when needed)
def init_cloudinary():
    """Initialize Cloudinary configuration - reads env vars fresh each time"""
    # Reload env vars each time to ensure latest values
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    api_key = os.getenv("CLOUDINARY_API_KEY", "")
    api_secret = os.getenv("CLOUDINARY_API_SECRET", "")
    
    if not cloud_name or not api_key or not api_secret:
        raise ValueError(
            f"Cloudinary configuration missing. "
            f"CLOUD_NAME: {'SET' if cloud_name else 'NOT SET'}, "
            f"API_KEY: {'SET' if api_key else 'NOT SET'}, "
            f"API_SECRET: {'SET' if api_secret else 'NOT SET'}"
        )
    
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )

# Initialize on import
try:
    init_cloudinary()
except ValueError:
    # Will be initialized when actually needed
    pass


def upload_video(file_path: str, folder: Optional[str] = None, resource_type: str = "video") -> Dict:
    """
    Upload video to Cloudinary
    
    Args:
        file_path: Path to the video file
        folder: Optional folder in Cloudinary
        resource_type: Type of resource (video/image)
    
    Returns:
        Dict with upload result containing:
        - public_id
        - secure_url
        - duration
        - width
        - height
        - format
        - bytes (size)
    """
    # Re-initialize to ensure latest env vars are used
    init_cloudinary()
    
    upload_preset = os.getenv("CLOUDINARY_UPLOAD_PRESET", "")
    
    upload_options = {
        "resource_type": resource_type,
    }
    
    if folder:
        upload_options["folder"] = folder
    
    if upload_preset:
        upload_options["upload_preset"] = upload_preset
    
    result = cloudinary.uploader.upload(
        file_path,
        **upload_options
    )
    
    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "duration": result.get("duration"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
        "metadata": result  # Store full response for reference
    }


def upload_video_from_url(video_url: str, folder: Optional[str] = None) -> Dict:
    """
    Upload video from URL to Cloudinary
    
    Args:
        video_url: URL of the video to upload
        folder: Optional folder in Cloudinary
    
    Returns:
        Dict with upload result
    """
    # Re-initialize to ensure latest env vars are used
    init_cloudinary()
    
    upload_preset = os.getenv("CLOUDINARY_UPLOAD_PRESET", "")
    
    upload_options = {
        "resource_type": "video",
    }
    
    if folder:
        upload_options["folder"] = folder
    
    if upload_preset:
        upload_options["upload_preset"] = upload_preset
    
    result = cloudinary.uploader.upload(
        video_url,
        **upload_options
    )
    
    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "duration": result.get("duration"),
        "width": result.get("width"),
        "height": result.get("height"),
        "format": result.get("format"),
        "bytes": result.get("bytes"),
        "metadata": result
    }


def delete_media(public_id: str, resource_type: str = "video") -> Dict:
    """
    Delete media from Cloudinary
    
    Args:
        public_id: Public ID of the media to delete
        resource_type: Type of resource (video/image)
    
    Returns:
        Dict with deletion result
    """
    # Re-initialize to ensure latest env vars are used
    init_cloudinary()
    
    try:
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type=resource_type
        )
        return {
            "success": result.get("result") == "ok",
            "public_id": public_id,
            "message": result.get("result")
        }
    except Exception as e:
        return {
            "success": False,
            "public_id": public_id,
            "error": str(e)
        }


def delete_multiple_media(public_ids: List[str], resource_type: str = "video") -> Dict:
    """
    Delete multiple media files from Cloudinary
    
    Args:
        public_ids: List of public IDs to delete
        resource_type: Type of resource (video/image)
    
    Returns:
        Dict with deletion results
    """
    # Re-initialize to ensure latest env vars are used
    init_cloudinary()
    
    if not public_ids:
        return {"success": True, "deleted": [], "failed": []}
    
    try:
        result = cloudinary.api.delete_resources(
            public_ids,
            resource_type=resource_type
        )
        
        deleted = result.get("deleted", {})
        failed = result.get("failed", {})
        
        return {
            "success": len(failed) == 0,
            "deleted": list(deleted.keys()),
            "failed": list(failed.keys()) if failed else []
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "deleted": [],
            "failed": public_ids
        }


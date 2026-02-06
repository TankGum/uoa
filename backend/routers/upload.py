from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import JSONResponse
from typing import Optional
import os
import time

from routers.auth import get_current_user_dependency

# Try to use cloudinary.utils for signature generation
try:
    from cloudinary.utils import api_sign_request
    USE_CLOUDINARY_UTILS = True
except ImportError:
    USE_CLOUDINARY_UTILS = False
    import hashlib
    import hmac
    import base64

from services import mux_service

router = APIRouter(prefix="/api/upload", tags=["upload"])


def generate_cloudinary_signature(params: dict, api_secret: str) -> str:
    """
    Generate Cloudinary signature for signed uploads
    Uses cloudinary.utils.api_sign_request if available, otherwise manual implementation
    """
    if USE_CLOUDINARY_UTILS:
        return api_sign_request(params, api_secret)
    else:
        # Manual implementation
        # Sort parameters alphabetically
        sorted_params = sorted(params.items())
        # Create string to sign - only include non-empty values
        string_to_sign = "&".join([f"{k}={v}" for k, v in sorted_params if v is not None and v != ""])
        # Generate signature using HMAC-SHA1
        signature = base64.b64encode(
            hmac.new(
                api_secret.encode('utf-8'),
                string_to_sign.encode('utf-8'),
                hashlib.sha1
            ).digest()
        ).decode('utf-8')
        return signature


@router.post("/sign")
def get_upload_signature(
    resource_type: str = Query("video", description="Resource type: 'image' or 'video'"),
    folder: Optional[str] = Query(None, description="Optional folder in Cloudinary"),
    current_user: str = Depends(get_current_user_dependency)
):
    """
    Generate Cloudinary signature for signed uploads
    Frontend should call this before uploading to get signature
    """
    
    upload_preset = os.getenv("CLOUDINARY_UPLOAD_PRESET", "")
    api_key = os.getenv("CLOUDINARY_API_KEY", "")
    api_secret = os.getenv("CLOUDINARY_API_SECRET", "")
    
    if not upload_preset or not api_key or not api_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cloudinary configuration not found"
        )
    
    # Generate timestamp
    timestamp = int(time.time())
    
    # Build parameters to sign (must match exactly what will be sent to Cloudinary)
    # Only include parameters that will be sent in the upload request
    params_to_sign = {
        "timestamp": timestamp,
        "upload_preset": upload_preset
    }
    
    # Add optional parameters if provided (must match exactly what FE will send)
    if folder:
        params_to_sign["folder"] = folder
    
    # Generate signature using cloudinary.utils if available (more reliable)
    signature = generate_cloudinary_signature(params_to_sign, api_secret)
    
    return JSONResponse(content={
        "timestamp": timestamp,
        "signature": signature
    })


@router.post("/mux-url")
def get_mux_upload_url(
    current_user: str = Depends(get_current_user_dependency)
):
    """
    Generate Mux direct upload URL
    """
    try:
        upload_data = mux_service.create_direct_upload()
        return upload_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

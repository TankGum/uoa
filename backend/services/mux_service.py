import mux_python
import os
from typing import Optional, Dict, List
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    load_dotenv(env_path)

# Initialize Mux configuration
def get_mux_client():
    token_id = os.getenv("MUX_TOKEN_ID")
    token_secret = os.getenv("MUX_TOKEN_SECRET")
    
    if not token_id or not token_secret:
        return None
        
    configuration = mux_python.Configuration()
    configuration.username = token_id
    configuration.password = token_secret
    return configuration

def create_direct_upload() -> Dict:
    """
    Create a direct upload URL for the frontend
    """
    config = get_mux_client()
    if not config:
        raise ValueError("Mux configuration missing (MUX_TOKEN_ID/MUX_TOKEN_SECRET)")
    
    uploads_api = mux_python.DirectUploadsApi(mux_python.ApiClient(config))
    
    create_asset_request = mux_python.CreateAssetRequest(
        playback_policy=[mux_python.PlaybackPolicy.PUBLIC],
        test=False # Set to True for testing without using minutes
    )
    
    create_upload_request = mux_python.CreateUploadRequest(
        timeout=3600,
        new_asset_settings=create_asset_request,
        cors_origin="*" # You might want to restrict this in production
    )
    
    api_response = uploads_api.create_direct_upload(create_upload_request)
    
    return {
        "upload_url": api_response.data.url,
        "upload_id": api_response.data.id,
        "status": api_response.data.status
    }

def get_upload_details(upload_id: str) -> Dict:
    """
    Get details about a direct upload
    """
    config = get_mux_client()
    if not config:
        return {}
    
    uploads_api = mux_python.DirectUploadsApi(mux_python.ApiClient(config))
    api_response = uploads_api.get_direct_upload(upload_id)
    
    return {
        "id": api_response.data.id,
        "status": api_response.data.status,
        "asset_id": api_response.data.asset_id
    }

def get_asset_details(asset_id: str) -> Dict:
    """
    Get asset details including playback ID
    """
    config = get_mux_client()
    if not config:
        return {}
    
    assets_api = mux_python.AssetsApi(mux_python.ApiClient(config))
    api_response = assets_api.get_asset(asset_id)
    
    playback_id = None
    if api_response.data.playback_ids:
        playback_id = api_response.data.playback_ids[0].id
    
    return {
        "asset_id": api_response.data.id,
        "status": api_response.data.status,
        "playback_id": playback_id,
        "duration": api_response.data.duration,
        "aspect_ratio": api_response.data.aspect_ratio,
        "max_stored_resolution": api_response.data.max_stored_resolution
    }

def delete_asset(asset_id: str) -> bool:
    """
    Delete asset from Mux
    """
    config = get_mux_client()
    if not config:
        return False
    
    assets_api = mux_python.AssetsApi(mux_python.ApiClient(config))
    try:
        assets_api.delete_asset(asset_id)
        return True
    except Exception as e:
        print(f"Error deleting Mux asset {asset_id}: {e}")
        return False

def get_playback_url(playback_id: str) -> str:
    """
    Generate HLS playback URL
    """
    if not playback_id:
        return ""
    return f"https://stream.mux.com/{playback_id}.m3u8"

def get_thumbnail_url(playback_id: str) -> str:
    """
    Generate thumbnail URL
    """
    if not playback_id:
        return ""
    return f"https://image.mux.com/{playback_id}/thumbnail.jpg"

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os
import hashlib
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

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Load environment variables
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")  # Plain text password

# Debug: Print if credentials are loaded (only show if not set to avoid exposing password)
if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    print(f"[AUTH DEBUG] ADMIN_USERNAME: {'SET' if ADMIN_USERNAME else 'NOT SET'}")
    print(f"[AUTH DEBUG] ADMIN_PASSWORD: {'SET' if ADMIN_PASSWORD else 'NOT SET'}")
    print(f"[AUTH DEBUG] Checking .env files...")
    print(f"[AUTH DEBUG] Backend .env exists: {env_path.exists()}")
    print(f"[AUTH DEBUG] Root .env exists: {parent_env_path.exists()}")

# Hash the password lazily (on first use) to avoid passlib init errors
# Bcrypt has a 72 byte limit, so we hash with SHA256 first if password is too long
ADMIN_PASSWORD_HASH = None

def _hash_password(password: str) -> str:
    """Hash password, handling long passwords by hashing with SHA256 first"""
    if not password:
        return ""
    try:
        password_bytes = password.encode('utf-8')
        # Always hash with SHA256 first to avoid bcrypt 72-byte limit issues
        # SHA256 hex digest is always 64 bytes, safe for bcrypt
        password_to_hash = hashlib.sha256(password_bytes).hexdigest()
        # Now hash with bcrypt (password_to_hash is always 64 bytes)
        return pwd_context.hash(password_to_hash)
    except Exception as e:
        print(f"[AUTH ERROR] Failed to hash password: {str(e)}")
        # If still fails, try with a shorter hash
        try:
            # Use first 32 bytes of SHA256 (64 hex chars = 32 bytes)
            password_to_hash = hashlib.sha256(password_bytes).digest()[:32].hex()
            return pwd_context.hash(password_to_hash)
        except Exception as e2:
            print(f"[AUTH ERROR] Fallback hash also failed: {str(e2)}")
            raise

def get_password_hash():
    """Get password hash, initializing if needed (lazy initialization)"""
    global ADMIN_PASSWORD_HASH
    if ADMIN_PASSWORD_HASH is None:
        ADMIN_PASSWORD_HASH = _hash_password(ADMIN_PASSWORD) if ADMIN_PASSWORD else ""
    return ADMIN_PASSWORD_HASH


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    if not plain_password or not hashed_password:
        return False
    try:
        # Always hash with SHA256 first (consistent with _hash_password)
        password_hash = hashlib.sha256(plain_password.encode('utf-8')).hexdigest()
        return pwd_context.verify(password_hash, hashed_password)
    except Exception as e:
        print(f"[AUTH ERROR] Password verification failed: {str(e)}")
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return username"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint"""
    # Check if admin credentials are configured
    if not ADMIN_USERNAME or not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in .env file",
        )
    
    # Verify credentials
    if form_data.username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, get_password_hash()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }


@router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current authenticated user"""
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": username}


def get_current_user_dependency(token: str = Depends(oauth2_scheme)):
    """Dependency to get current user - can be used in other routes"""
    username = verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username


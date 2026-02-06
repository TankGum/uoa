from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Optional, List, Any, Generic, TypeVar
from datetime import datetime
from uuid import UUID

T = TypeVar('T')

# Pagination Response Schema
class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int

# Media Schemas
class MediaBase(BaseModel):
    type: str
    provider: Optional[str] = None
    public_id: Optional[str] = None
    url: str
    duration: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    size: Optional[int] = None
    meta_data: Optional[dict] = Field(None, alias="metadata")  # Map to database column "metadata"
    is_featured: Optional[bool] = False
    display_order: Optional[int] = 0

class MediaCreate(MediaBase):
    post_id: UUID

class Media(MediaBase):
    id: UUID
    post_id: UUID
    created_at: datetime
    
    @field_validator('meta_data', mode='before')
    @classmethod
    def convert_metadata(cls, v):
        """Convert metadata from SQLAlchemy object to dict"""
        if v is None:
            return None
        if isinstance(v, dict):
            return v
        # Handle SQLAlchemy JSONB objects or other types
        try:
            # If it's a MetaData object or similar, convert to dict
            if hasattr(v, '__dict__') and not isinstance(v, dict):
                return dict(v.__dict__)
            elif hasattr(v, '_asdict'):
                return v._asdict()
            else:
                # Try JSON serialization
                import json
                return json.loads(json.dumps(v, default=str))
        except:
            return None
    
    class Config:
        from_attributes = True
        populate_by_name = True  # Allow both alias and field name
        # Exclude SQLAlchemy internal attributes
        exclude = {'__table__', '__mapper__', '__mapper_args__', '__table_args__'}

# Category Schemas
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = 'draft'

class MediaCreateInput(BaseModel):
    """Media data from upload provider"""
    type: str = "image"
    provider: str = "cloudinary"
    public_id: str # Mux PlaybackID or Cloudinary PublicID
    secure_url: str # Mux HLS URL or Cloudinary URL
    asset_id: Optional[str] = None # For Mux Asset ID
    duration: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    size: Optional[int] = None
    is_featured: Optional[bool] = False
    display_order: Optional[int] = 0
    metadata: Optional[dict] = None

class PostCreate(PostBase):
    category_ids: Optional[List[UUID]] = []  # Tags/Categories
    media: Optional[List[MediaCreateInput]] = []  # Media from Cloudinary

class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    category_ids: Optional[List[UUID]] = None
    media: Optional[List[MediaCreateInput]] = None  # Media from Cloudinary (None = keep existing, [] = remove all, [items] = replace)

class Post(PostBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    media: List[Media] = []
    categories: List[Category] = []
    
    @model_validator(mode='before')
    @classmethod
    def validate_relationships(cls, data: Any):
        """Ensure relationships are properly loaded and filter out Table objects"""
        if isinstance(data, dict):
            # If it's already a dict, ensure no Table objects
            for key, value in list(data.items()):
                if hasattr(value, '__class__') and 'Table' in str(type(value)):
                    # Remove Table objects
                    data.pop(key, None)
        elif hasattr(data, '__dict__'):
            # If it's an object, convert relationships to lists
            if hasattr(data, 'media'):
                try:
                    media_list = list(data.media) if data.media else []
                    # Filter out any Table objects
                    media_list = [m for m in media_list if not (hasattr(m, '__class__') and 'Table' in str(type(m)))]
                    data.media = media_list
                except:
                    data.media = []
            if hasattr(data, 'categories'):
                try:
                    categories_list = list(data.categories) if data.categories else []
                    # Filter out any Table objects
                    categories_list = [c for c in categories_list if not (hasattr(c, '__class__') and 'Table' in str(type(c)))]
                    data.categories = categories_list
                except:
                    data.categories = []
        return data
    
    class Config:
        from_attributes = True

# Booking Schemas
class BookingBase(BaseModel):
    client_name: str
    client_email: EmailStr
    start_time: datetime
    end_time: datetime
    message: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    client_name: Optional[str] = None
    client_email: Optional[EmailStr] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    message: Optional[str] = None

class Booking(BookingBase):
    id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


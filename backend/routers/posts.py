from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional
import uuid

from database import get_db
from models import Post, Category, Media
from models import post_categories  # Import Table separately
from schemas import Post as PostSchema, PostCreate, PostUpdate, Media as MediaSchema, PaginatedResponse
from services.cloudinary_service import delete_media
from routers.auth import get_current_user_dependency

router = APIRouter(prefix="/api/posts", tags=["posts"])


def determine_media_type(media_data) -> str:
    """
    Determine media type from Cloudinary metadata
    Since files are already uploaded to Cloudinary, we can rely on the metadata
    """
    # Check duration first (videos have duration, images don't)
    if media_data.duration:
        return "video"
    
    # Check format as fallback
    if media_data.format:
        video_formats = ["mp4", "mov", "avi", "webm", "mkv", "flv", "wmv"]
        if media_data.format.lower() in video_formats:
            return "video"
    
    return "image"


def post_to_dict(db_post) -> dict:
    """
    Convert Post SQLAlchemy object to dict for serialization
    Avoids Table serialization issues
    """
    return {
        'id': db_post.id,
        'title': db_post.title,
        'description': db_post.description,
        'status': db_post.status,
        'created_at': db_post.created_at,
        'updated_at': db_post.updated_at,
        'media': [
            {
                'id': m.id,
                'post_id': m.post_id,
                'type': m.type,
                'provider': m.provider,
                'public_id': m.public_id,
                'url': m.url,
                'duration': float(m.duration) if m.duration else None,
                'width': m.width,
                'height': m.height,
                'format': m.format,
                'size': m.size,
                'meta_data': m.meta_data if isinstance(m.meta_data, dict) else None,
                'is_featured': m.is_featured if hasattr(m, 'is_featured') else False,
                'display_order': m.display_order if hasattr(m, 'display_order') else 0,
                'created_at': m.created_at
            }
            for m in sorted(db_post.media, key=lambda x: (not (x.is_featured if hasattr(x, 'is_featured') else False), x.display_order if hasattr(x, 'display_order') else 0))
        ],
        'categories': [
            {
                'id': c.id,
                'name': c.name,
                'created_at': c.created_at
            }
            for c in db_post.categories
        ]
    }


@router.get("", response_model=PaginatedResponse[PostSchema])
def get_posts(
    status: Optional[str] = None,
    category_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 12,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "desc",
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Base query
    base_query = db.query(Post)
    
    if status:
        base_query = base_query.filter(Post.status == status)
    
    if category_id:
        base_query = base_query.join(post_categories).filter(post_categories.c.category_id == category_id)
    
    # Handle search
    if search:
        search_term = f"%{search.lower()}%"
        base_query = base_query.filter(
            or_(
                Post.title.ilike(search_term),
                Post.description.ilike(search_term)
            )
        )
    
    # Get total count
    total = base_query.count()
    
    # Get paginated posts
    query = base_query.options(
        joinedload(Post.media),
        joinedload(Post.categories)
    )
    
    # Handle sorting
    if sort_by:
        sort_column = None
        if sort_by == "title":
            sort_column = Post.title
        elif sort_by == "status":
            sort_column = Post.status
        elif sort_by == "created":
            sort_column = Post.created_at
        
        if sort_column:
            if sort_order == "asc":
                query = query.order_by(sort_column.asc())
            else:
                query = query.order_by(sort_column.desc())
        else:
            # Default sort
            query = query.order_by(Post.created_at.desc())
    else:
        # Default sort
        query = query.order_by(Post.created_at.desc())
    
    posts = query.offset(skip).limit(limit).all()
    
    # Convert to dict to avoid Table serialization issues
    result = []
    for post in posts:
        post_dict = {
            'id': post.id,
            'title': post.title,
            'description': post.description,
            'status': post.status,
            'created_at': post.created_at,
            'updated_at': post.updated_at,
        'media': [
            {
                'id': m.id,
                'post_id': m.post_id,
                'type': m.type,
                'provider': m.provider,
                'public_id': m.public_id,
                'url': m.url,
                'duration': float(m.duration) if m.duration else None,
                'width': m.width,
                'height': m.height,
                'format': m.format,
                'size': m.size,
                'meta_data': m.meta_data if isinstance(m.meta_data, dict) else None,
                'is_featured': m.is_featured if hasattr(m, 'is_featured') else False,
                'display_order': m.display_order if hasattr(m, 'display_order') else 0,
                'created_at': m.created_at
            }
            for m in sorted(post.media, key=lambda x: (not (x.is_featured if hasattr(x, 'is_featured') else False), x.display_order if hasattr(x, 'display_order') else 0))
        ],
            'categories': [
                {
                    'id': c.id,
                    'name': c.name,
                    'created_at': c.created_at
                }
                for c in post.categories
            ]
        }
        result.append(PostSchema(**post_dict))
    
    page = (skip // limit) + 1
    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    
    return {
        'items': result,
        'total': total,
        'page': page,
        'page_size': limit,
        'total_pages': total_pages
    }


@router.get("/{post_id}", response_model=PostSchema)
def get_post(post_id: uuid.UUID, db: Session = Depends(get_db)):
    post = db.query(Post).options(
        joinedload(Post.media),
        joinedload(Post.categories)
    ).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    # Convert to dict to avoid Table serialization issues
    post_dict = {
        'id': post.id,
        'title': post.title,
        'description': post.description,
        'status': post.status,
        'created_at': post.created_at,
        'updated_at': post.updated_at,
        'media': [
            {
                'id': m.id,
                'post_id': m.post_id,
                'type': m.type,
                'provider': m.provider,
                'public_id': m.public_id,
                'url': m.url,
                'duration': float(m.duration) if m.duration else None,
                'width': m.width,
                'height': m.height,
                'format': m.format,
                'size': m.size,
                'meta_data': m.meta_data if isinstance(m.meta_data, dict) else None,
                'is_featured': m.is_featured if hasattr(m, 'is_featured') else False,
                'display_order': m.display_order if hasattr(m, 'display_order') else 0,
                'created_at': m.created_at
            }
            for m in sorted(post.media, key=lambda x: (not (x.is_featured if hasattr(x, 'is_featured') else False), x.display_order if hasattr(x, 'display_order') else 0))
        ],
        'categories': [
            {
                'id': c.id,
                'name': c.name,
                'created_at': c.created_at
            }
            for c in post.categories
        ]
    }
    
    return PostSchema(**post_dict)


@router.post("", response_model=PostSchema, status_code=status.HTTP_201_CREATED)
def create_post(post: PostCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    # Create post
    db_post = Post(**post.dict(exclude={'category_ids', 'media'}))
    
    # Add categories (tags)
    if post.category_ids:
        categories = db.query(Category).filter(Category.id.in_(post.category_ids)).all()
        db_post.categories = categories
    
    db.add(db_post)
    db.flush()  # Flush to get post.id
    
    # Add media from Cloudinary (metadata only - files already uploaded)
    if post.media:
        for idx, media_data in enumerate(post.media):
            db_media = Media(
                post_id=db_post.id,
                type=determine_media_type(media_data),
                provider="cloudinary",
                public_id=media_data.public_id,
                url=media_data.secure_url,
                duration=media_data.duration,
                width=media_data.width,
                height=media_data.height,
                format=media_data.format,
                size=media_data.size,
                is_featured=bool(getattr(media_data, 'is_featured', False)),
                display_order=int(getattr(media_data, 'display_order', idx))
            )
            db.add(db_media)
    
    db.commit()
    
    # Reload post with relationships
    db_post = db.query(Post).options(
        joinedload(Post.media),
        joinedload(Post.categories)
    ).filter(Post.id == db_post.id).first()
    
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    return PostSchema(**post_to_dict(db_post))


@router.put("/{post_id}", response_model=PostSchema)
def update_post(post_id: uuid.UUID, post_update: PostUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_post = db.query(Post).options(
        joinedload(Post.media)
    ).filter(Post.id == post_id).first()
    
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # Store old media before update
    old_media = list(db_post.media) if db_post.media else []
    
    update_data = post_update.dict(exclude_unset=True, exclude={'category_ids', 'media'})
    for field, value in update_data.items():
        setattr(db_post, field, value)
    
    if post_update.category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(post_update.category_ids)).all()
        db_post.categories = categories
    
    # Handle media update
    if post_update.media is not None:
        # Get public_ids of new media
        new_public_ids = {m.public_id for m in post_update.media if m.public_id}
        
        # Delete old media from Cloudinary that are not in new list
        for old_media_item in old_media:
            if old_media_item.provider == "cloudinary" and old_media_item.public_id:
                # Only delete if not in new media list
                if old_media_item.public_id not in new_public_ids:
                    try:
                        resource_type = "video" if old_media_item.type == "video" else "image"
                        delete_result = delete_media(old_media_item.public_id, resource_type=resource_type)
                        if not delete_result.get("success"):
                            print(f"Warning: Failed to delete old media {old_media_item.public_id} from Cloudinary: {delete_result.get('error', delete_result.get('message'))}")
                    except Exception as e:
                        print(f"Warning: Error deleting old media {old_media_item.public_id} from Cloudinary: {str(e)}")
        
        # Remove all old media from database
        for old_media_item in old_media:
            db.delete(old_media_item)
        
        # Add new media (metadata only - files already uploaded to Cloudinary)
        for idx, media_data in enumerate(post_update.media):
            db_media = Media(
                post_id=db_post.id,
                type=determine_media_type(media_data),
                provider="cloudinary",
                public_id=media_data.public_id,
                url=media_data.secure_url,
                duration=media_data.duration,
                width=media_data.width,
                height=media_data.height,
                format=media_data.format,
                size=media_data.size,
                is_featured=bool(getattr(media_data, 'is_featured', False)),
                display_order=int(getattr(media_data, 'display_order', idx))
            )
            db.add(db_media)
    
    db.commit()
    
    # Reload post with relationships
    db_post = db.query(Post).options(
        joinedload(Post.media),
        joinedload(Post.categories)
    ).filter(Post.id == db_post.id).first()
    
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    return PostSchema(**post_to_dict(db_post))


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: uuid.UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_post = db.query(Post).options(
        joinedload(Post.media)
    ).filter(Post.id == post_id).first()
    
    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    # Delete media from Cloudinary before deleting post
    if db_post.media:
        for media in db_post.media:
            # Only delete if provider is cloudinary and public_id exists
            if media.provider == "cloudinary" and media.public_id:
                try:
                    # Determine resource type based on media type
                    resource_type = "video" if media.type == "video" else "image"
                    delete_result = delete_media(media.public_id, resource_type=resource_type)
                    if not delete_result.get("success"):
                        # Log error but continue with deletion
                        print(f"Warning: Failed to delete media {media.public_id} from Cloudinary: {delete_result.get('error', delete_result.get('message'))}")
                except Exception as e:
                    # Log error but continue with deletion
                    print(f"Warning: Error deleting media {media.public_id} from Cloudinary: {str(e)}")
    
    # Delete post (cascade will delete media records in DB)
    db.delete(db_post)
    db.commit()
    return None


@router.get("/{post_id}/media", response_model=List[MediaSchema])
def get_post_media(post_id: uuid.UUID, db: Session = Depends(get_db)):
    media = db.query(Media).filter(Media.post_id == post_id).all()
    return media


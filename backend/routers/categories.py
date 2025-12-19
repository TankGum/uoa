from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from models import Category
from schemas import Category as CategorySchema, CategoryCreate
from routers.auth import get_current_user_dependency

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("", response_model=List[CategorySchema])
def get_categories(
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Category)
    
    # Handle search
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(Category.name.ilike(search_term))
    
    # Handle sorting
    if sort_by:
        sort_column = None
        if sort_by == "name":
            sort_column = Category.name
        elif sort_by == "created":
            sort_column = Category.created_at
        
        if sort_column:
            if sort_order == "asc":
                query = query.order_by(sort_column.asc())
            else:
                query = query.order_by(sort_column.desc())
        else:
            # Default sort
            query = query.order_by(Category.name.asc())
    else:
        # Default sort
        query = query.order_by(Category.name.asc())
    
    categories = query.all()
    return categories


@router.post("", response_model=CategorySchema, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: uuid.UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return None


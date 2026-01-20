from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
import uuid

from database import get_db
from models import Booking
from schemas import Booking as BookingSchema, BookingCreate, BookingUpdate, PaginatedResponse
from routers.auth import get_current_user_dependency

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.get("", response_model=PaginatedResponse[BookingSchema])
def get_bookings(
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 10,
    sort_by: Optional[str] = None,
    sort_order: Optional[str] = "asc",
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Base query
    base_query = db.query(Booking)
    
    if status:
        base_query = base_query.filter(Booking.status == status)
    
    if start_date:
        base_query = base_query.filter(Booking.start_time >= start_date)
    
    if end_date:
        base_query = base_query.filter(Booking.end_time <= end_date)
    
    # Handle search
    if search:
        from sqlalchemy import or_
        search_term = f"%{search.lower()}%"
        base_query = base_query.filter(
            or_(
                Booking.client_name.ilike(search_term),
                Booking.client_email.ilike(search_term)
            )
        )
    
    # Get total count
    total = base_query.count()
    
    # Handle sorting
    if sort_by:
        sort_column = None
        if sort_by == "client_name":
            sort_column = Booking.client_name
        elif sort_by == "email":
            sort_column = Booking.client_email
        elif sort_by == "start_time":
            sort_column = Booking.start_time
        elif sort_by == "end_time":
            sort_column = Booking.end_time
        elif sort_by == "status":
            sort_column = Booking.status
        elif sort_by == "created":
            sort_column = Booking.created_at
        
        if sort_column:
            if sort_order == "asc":
                base_query = base_query.order_by(sort_column.asc())
            else:
                base_query = base_query.order_by(sort_column.desc())
        else:
            # Default sort
            base_query = base_query.order_by(Booking.start_time.asc())
    else:
        # Default sort
        base_query = base_query.order_by(Booking.start_time.asc())
    
    # Get paginated bookings
    bookings = base_query.offset(skip).limit(limit).all()
    
    page = (skip // limit) + 1
    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    
    return {
        'items': bookings,
        'total': total,
        'page': page,
        'page_size': limit,
        'total_pages': total_pages
    }


@router.get("/{booking_id}", response_model=BookingSchema)
def get_booking(booking_id: uuid.UUID, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("", response_model=BookingSchema, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Basic validation
    if booking.start_time >= booking.end_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )
    
    # Create booking (no overlap check for contact form submissions)
    db_booking = Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.put("/{booking_id}", response_model=BookingSchema)
def update_booking(booking_id: uuid.UUID, booking_update: BookingUpdate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    update_data = booking_update.dict(exclude_unset=True)
    
    # Check for overlapping bookings if time is being updated
    if 'start_time' in update_data or 'end_time' in update_data:
        start_time = update_data.get('start_time', db_booking.start_time)
        end_time = update_data.get('end_time', db_booking.end_time)
        
        if start_time >= end_time:
            raise HTTPException(
                status_code=400,
                detail="End time must be after start time"
            )
        
        overlapping = db.query(Booking).filter(
            and_(
                Booking.id != booking_id,
                Booking.status.in_(['pending', 'confirmed']),
                or_(
                    and_(
                        Booking.start_time <= start_time,
                        Booking.end_time > start_time
                    ),
                    and_(
                        Booking.start_time < end_time,
                        Booking.end_time >= end_time
                    ),
                    and_(
                        Booking.start_time >= start_time,
                        Booking.end_time <= end_time
                    )
                )
            )
        ).first()
        
        if overlapping:
            raise HTTPException(
                status_code=400,
                detail="Time slot is already booked"
            )
    
    for field, value in update_data.items():
        setattr(db_booking, field, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: uuid.UUID, db: Session = Depends(get_db), current_user: str = Depends(get_current_user_dependency)):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(db_booking)
    db.commit()
    return None


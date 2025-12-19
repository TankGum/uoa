from sqlalchemy import Column, String, Text, Integer, BigInteger, Numeric, ForeignKey, Table, CheckConstraint, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from database import Base

# Junction table for many-to-many relationship
post_categories = Table(
    'post_categories',
    Base.metadata,
    Column('post_id', UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True),
    Column('category_id', UUID(as_uuid=True), ForeignKey('categories.id', ondelete='CASCADE'), primary_key=True)
)

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default='draft')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    media = relationship("Media", back_populates="post", cascade="all, delete-orphan")
    categories = relationship("Category", secondary=post_categories, back_populates="posts")
    
    __table_args__ = (
        CheckConstraint("status IN ('draft', 'published')", name='check_post_status'),
    )

class Media(Base):
    __tablename__ = "media"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey('posts.id', ondelete='CASCADE'))
    type = Column(String, nullable=False)
    provider = Column(String)
    public_id = Column(String)
    url = Column(String, nullable=False)
    duration = Column(Numeric)
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String)
    size = Column(BigInteger)
    meta_data = Column("metadata", JSONB)  # Database column name is "metadata", Python attribute is "meta_data"
    is_featured = Column(Boolean, default=False)  # Mark featured/primary media for post
    display_order = Column(Integer, default=0)  # Order for displaying media
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    post = relationship("Post", back_populates="media")
    
    __table_args__ = (
        CheckConstraint("type IN ('image', 'video')", name='check_media_type'),
    )

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    posts = relationship("Post", secondary=post_categories, back_populates="categories")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True), nullable=False)
    status = Column(String, default='pending')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'confirmed', 'canceled')", name='check_booking_status'),
    )


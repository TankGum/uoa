# Filmmaker & Photographer Portfolio Website

A modern portfolio website for filmmakers and photographers built with React + Vite frontend and Python FastAPI backend.

## Features

- **Portfolio Gallery**: Display posts with images and videos
- **Categories**: Organize posts by categories
- **Booking System**: Allow clients to book sessions with conflict detection
- **Admin Panel**: Manage posts, bookings, and categories
- **Media Management**: Support for images and videos with metadata
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL

### Infrastructure
- Docker & Docker Compose

## Project Structure

```
portfolio/
├── backend/
│   ├── db/
│   │   └── init.sql          # Database schema
│   ├── main.py               # FastAPI application
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # Database connection
│   ├── Dockerfile            # Backend Docker image
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── api/            # API client
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml        # Docker orchestration
```

## Database Schema

- **posts**: Portfolio posts with title, description, and status
- **media**: Images and videos linked to posts
- **categories**: Post categories
- **post_categories**: Many-to-many relationship
- **bookings**: Client booking requests with time slot validation

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local frontend development, optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Start the services with Docker Compose:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- Frontend development server on port 5173 (if running locally)

### Running Frontend Locally (Optional)

If you prefer to run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## API Endpoints

### Posts
- `GET /api/posts` - List all posts
- `GET /api/posts/{id}` - Get post details
- `POST /api/posts` - Create new post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

### Media
- `POST /api/media` - Add media to post
- `GET /api/posts/{id}/media` - Get post media
- `DELETE /api/media/{id}` - Delete media

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/{id}` - Delete category

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings` - Create booking (with conflict detection)
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

## Environment Variables

Backend environment variables (set in docker-compose.yml):
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT (change in production)

## Development

### Backend Development

The backend runs with hot-reload enabled. Changes to Python files will automatically restart the server.

### Database Migrations

The database schema is initialized automatically when the PostgreSQL container starts using `backend/db/init.sql`.

### Adding New Features

1. Update database schema in `backend/db/init.sql` if needed
2. Add SQLAlchemy models in `backend/models.py`
3. Add Pydantic schemas in `backend/schemas.py`
4. Add API routes in `backend/main.py`
5. Create frontend components in `frontend/src/`

## Production Deployment

1. Update `SECRET_KEY` in `docker-compose.yml`
2. Configure proper CORS origins in `backend/main.py`
3. Set up reverse proxy (nginx) for production
4. Use environment-specific Docker Compose files
5. Set up SSL certificates

## License

MIT


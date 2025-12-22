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

- **Docker** (version 20.10+) and **Docker Compose** (version 2.0+)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd portfolio
```

#### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Cloudinary Configuration (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
SECRET_KEY=your-secret-key-for-jwt-change-in-production
```

**Note**: Make sure to use UTF-8 encoding (without BOM) when creating the `.env` file.

#### 3. Start Services with Docker

Start all services (PostgreSQL database, FastAPI backend, and React frontend):

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL database** on port `5432`
- **FastAPI backend** on port `8000`
- **React frontend** on port `5173`

The database schema is automatically initialized when the PostgreSQL container starts using `backend/db/init.sql`.

### Accessing the Application

After starting Docker containers, access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation (Swagger)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Admin Panel**: http://localhost:5173/admin (requires login)

### Admin Credentials

Use the credentials from your `.env` file:
- **Username**: Your configured `ADMIN_USERNAME` (default: `admin`)
- **Password**: Your configured `ADMIN_PASSWORD`

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

### Backend (.env file)

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | Yes |
| `ADMIN_USERNAME` | Admin login username | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `SECRET_KEY` | JWT secret key (change in production) | Yes |

### Database (docker-compose.yml)

- `POSTGRES_USER`: postgres
- `POSTGRES_PASSWORD`: 111111
- `POSTGRES_DB`: portfolio_db
- `DATABASE_URL`: Automatically set in backend container

## Docker Commands

### Basic Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f db

# Rebuild containers after code changes
docker-compose up -d --build

# Stop and remove all containers and volumes
docker-compose down -v
```

### Database Commands

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U postgres -d portfolio_db

# Run migrations manually
docker-compose exec -T db psql -U postgres -d portfolio_db < backend/migrations/add_featured_media.sql

# Backup database
docker-compose exec db pg_dump -U postgres portfolio_db > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres -d portfolio_db < backup.sql
```

### Container Management

```bash
# Access container shells
docker-compose exec backend bash
docker-compose exec frontend sh

# Check container status
docker-compose ps

# Restart specific services
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

## Troubleshooting

**Backend won't start:**
- Check if `.env` file exists and has correct values
- Verify Docker containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Ensure port 8000 is not in use
- Rebuild containers: `docker-compose up -d --build`

**Database connection errors:**
- Verify PostgreSQL container is healthy: `docker-compose ps db`
- Check database logs: `docker-compose logs db`
- Ensure database is initialized: Check `backend/db/init.sql` exists
- Restart database: `docker-compose restart db`

**Frontend can't connect to backend:**
- Verify both containers are running: `docker-compose ps`
- Check frontend logs: `docker-compose logs frontend`
- Check backend logs: `docker-compose logs backend`
- Ensure backend is accessible at http://localhost:8000
- Check CORS settings in `backend/main.py`
- Verify frontend proxy configuration in `frontend/vite.config.js`

**Upload errors:**
- Verify Cloudinary credentials in `.env` file
- Check Cloudinary upload preset is configured correctly
- Ensure `.env` file uses UTF-8 encoding (without BOM)

## Production Deployment

### Pre-deployment Checklist

1. **Update environment variables:**
   - Change `SECRET_KEY` to a strong random value
   - Update `ADMIN_PASSWORD` to a secure password
   - Verify all Cloudinary credentials are correct

2. **Configure CORS:**
   - Update `CORS_ORIGINS` in `backend/main.py` to your production domain
   - Remove development origins

3. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```
   The built files will be in `frontend/dist/`

4. **Set up reverse proxy:**
   - Use nginx or similar to serve frontend static files
   - Proxy API requests to backend on port 8000
   - Configure SSL certificates (Let's Encrypt recommended)

5. **Database backup:**
   - Set up regular database backups
   - Consider using managed PostgreSQL service for production

6. **Docker Compose production:**
   - Create `docker-compose.prod.yml` with production settings
   - Remove volume mounts for code (use built images)
   - Set restart policies: `restart: unless-stopped`

### Example Production docker-compose.prod.yml

```yaml
services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: portfolio_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - .env
    environment:
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/portfolio_db
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```


## License

MIT


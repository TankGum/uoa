---
name: database-migration-for-docker
description: Tạo hệ thống migration database hoàn chỉnh cho project FastAPI + PostgreSQL trên Docker, hỗ trợ: Tracking migrations với Alembic, Custom SQL migrations cho các thay đổi phức tạp, Commands Docker để chạy migrations, Templates cho add/modify/delete fields.
---


Cấu trúc files sẽ tạo
1. Alembic Configuration
backend/alembic.ini - Cấu hình Alembic
backend/alembic/env.py - Environment setup cho Alembic
backend/alembic/script.py.mako - Template cho migration files
2. Migration Management Scripts
backend/scripts/migrate.py - Script quản lý migrations (create, apply, rollback)
backend/scripts/create_migration.sh - Helper script tạo migration mới
3. Migration Templates
backend/migrations/templates/add_column.sql - Template thêm column
backend/migrations/templates/modify_column.sql - Template sửa column
backend/migrations/templates/delete_column.sql - Template xóa column
backend/migrations/templates/add_table.sql - Template thêm table
4. Documentation
.cursor/skills/database-migration/SKILL.md - Skill documentation với:
Workflow migration
Commands Docker
Examples cho các operations
Best practices
Implementation Details
Alembic Setup
Initialize Alembic trong backend/ directory
Configure alembic.ini để connect với PostgreSQL trong Docker
Setup env.py để import models từ models.py
Tạo initial migration từ current schema
Migration Script Structure
Mỗi migration có:
Version number (Alembic)
SQL file (nếu cần custom SQL)
Description
Up/Down operations
Docker Commands
docker-compose exec backend alembic upgrade head - Apply all migrations
docker-compose exec backend alembic revision --autogenerate -m "description" - Tạo migration từ models
docker-compose exec -T db psql -U postgres -d portfolio_db < migration.sql - Chạy SQL migration
Migration Workflow
Thay đổi models trong models.py
Tạo migration: alembic revision --autogenerate hoặc tạo SQL file
Review migration file
Apply: alembic upgrade head hoặc chạy SQL
Verify changes
Files to Create/Modify
backend/alembic.ini - Alembic configuration
backend/alembic/env.py - Alembic environment setup
backend/alembic/script.py.mako - Migration template
backend/scripts/migrate.py - Migration management script
backend/migrations/templates/ - SQL templates
.cursor/skills/database-migration/SKILL.md - Skill documentation
docker-compose.yml - Thêm volume cho migrations (nếu cần)
Migration Examples trong Skill
Add Column
ALTER TABLE table_name 
ADD COLUMN IF NOT EXISTS column_name TYPE DEFAULT value;
Modify Column
ALTER TABLE table_name 
ALTER COLUMN column_name TYPE new_type USING column_name::new_type;
Delete Column
ALTER TABLE table_name 
DROP COLUMN IF EXISTS column_name;
Add Index
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);
Safety Features
IF NOT EXISTS / IF EXISTS cho idempotent migrations
Backup commands trước khi migrate
Rollback instructions
Validation checks
Docker Integration
Tất cả commands chạy trong Docker containers
Support cho cả development và production
Health checks trước khi migrate
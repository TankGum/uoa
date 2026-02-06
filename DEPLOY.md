# Hướng dẫn triển khai Portfolio lên VPS

Tài liệu này hướng dẫn cách triển khai ứng dụng bằng Docker và Nginx trên máy chủ VPS.

## 1. Yêu cầu hệ thống
- Một máy chủ Ubuntu (hoặc tương tự) đã cài đặt:
  - Docker
  - Docker Compose
  - Git

## 2. Các bước chuẩn bị

### Bước 1: Clone mã nguồn
```bash
git clone <your-repo-url>
cd portfolio
```

### Bước 2: Cấu hình môi trường
Tạo file `.env.prod` từ file ví dụ:
```bash
cp .env.prod.example .env.prod
```
Chỉnh sửa file `.env.prod` và thay thế các giá trị bằng thông tin thực tế của bạn (Cloudinary, Mux, Admin password, Database password).

## 3. Triển khai theo mô hình Gateway (Nhiều project trên 1 VPS)

Mô hình này giống với dự án Barebershop của bạn, sử dụng một Nginx tổng trên VPS làm Gateway.

### Bước 3.1: Kết nối Network
Để Nginx Gateway có thể thấy các container của dự án này, bạn cần đảm bảo chúng nằm cùng một Docker Network. 
Trong `docker-compose.prod.yml`, tôi đã đặt tên network là `portfolio_network`. 

Nếu bạn có một network chung cho toàn bộ VPS (ví dụ: `web_proxy`), hãy sửa phần `networks` ở cuối file thành:
```yaml
networks:
  portfolio_net:
    external: true
    name: web_proxy
```

### Bước 3.2: Cấu hình Nginx trên VPS
1. Tạo file cấu hình mới: `/etc/nginx/conf.d/portfolio.conf` trên VPS.
2. Copy nội dung từ file `nginx/portfolio.conf` (trong dự án) vào đó.
3. Thay thế `yourdomain.com` bằng tên miền thật của bạn.

### Bước 3.3: Chạy Certbot
Sau khi đã cấu hình Nginx port 80, hãy chạy Certbot để lấy SSL:
```bash
docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d yourdomain.com
```

### Bước 3.4: Khởi chạy dự án
```bash
chmod +x deploy.sh
./deploy.sh
```

Hoặc chạy thủ công bằng Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## 4. Kiểm tra trạng thái
Kiểm tra xem các container có đang chạy không:
```bash
docker ps
```

## 5. Cấu trúc hệ thống trong Docker
- **Frontend Container**: Chạy Nginx để phục vụ file tĩnh và proxy các yêu cầu `/api` sang backend.
- **Backend Container**: Chạy FastAPI (Uvicorn).
- **Database Container**: Chạy PostgreSQL 15.

## 6. Lưu ý bảo mật
- Luôn thay đổi `SECRET_KEY` trong file `.env.prod`.
- Không chia sẻ file `.env.prod` lên GitHub.
- Đảm bảo tường lửa trên VPS chỉ mở các port cần thiết (80, 443, 22).

## 7. Cập nhật ứng dụng
Mỗi khi có code mới, bạn chỉ cần thực hiện:
```bash
git pull origin main
./deploy.sh
```

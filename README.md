# 🧭 Task Manager Web App (MERN + AWS ECS + CloudFront)

Một ứng dụng quản lý công việc (Task Manager) được phát triển bằng **React**, **Node.js**, và **MongoDB**, triển khai trên **AWS ECS (Fargate)** với frontend được phân phối qua **CloudFront (HTTPS)**.

---

## 🚀 1. Kiến trúc hệ thống


- **Frontend**: React build, deploy qua S3 + CloudFront (HTTPS)
- **Backend (API)**: Node.js + Express chạy trên AWS ECS Fargate
- **Database**: MongoDB Atlas (Cloud)
- **CI/CD**: Tự động build & deploy bằng GitHub Actions (tùy chọn)
- **SSL/HTTPS**: CloudFront cung cấp chứng chỉ HTTPS miễn phí

---
 Deploy lên AWS ECS + CloudFront
1. ECS (Backend)

Tạo Task Definition cho container backend (Node.js)

Chạy trong ECS Service (Fargate)

Cấu hình Security Group mở port 3001

Gán public IP hoặc private IP tùy nhu cầu

2. CloudFront (Frontend + HTTPS)

Tạo S3 bucket chứa build frontend

Tạo CloudFront Distribution

Origin domain = S3 bucket (frontend)

Alternate domain (CNAME) = tên miền tùy chọn (nếu có)

SSL certificate = “Amazon issued certificate (ACM)”

Đảm bảo Redirect HTTP → HTTPS bật ON

3. CloudFront proxy backend (HTTPS fix)

Vì ECS chỉ chạy HTTP, bạn cần CloudFront để chuyển tiếp an toàn:

Origin domain = 13.212.224.55:3001

Protocol = HTTP only

Behavior:

Viewer protocol policy → “Redirect HTTP to HTTPS”

Allowed methods → GET, POST, PUT, DELETE

Cache policy → disable cache (hoặc custom)

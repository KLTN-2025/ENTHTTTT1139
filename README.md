# 🎓 EduLink - Nền tảng Học tập Trực tuyến

<div align="center">

![EduLink Logo](https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=EduLink)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.1.0-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://postgresql.org/)

**Nền tảng học tập trực tuyến dành cho học sinh, sinh viên và người có nhu cầu học thêm kiến thức tại Việt Nam**

[🌐 Demo Live](#) • [📖 Tài liệu](#) • [🐛 Báo lỗi](https://github.com/your-repo/issues) • [💡 Góp ý](https://github.com/your-repo/issues)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

---

## 🚀 Giới thiệu

**EduLink** là một nền tảng học tập trực tuyến toàn diện được thiết kế đặc biệt cho thị trường Việt Nam. Ứng dụng kết nối học viên với các giảng viên chất lượng, cung cấp các khóa học đa dạng từ công nghệ thông tin, kinh doanh, thiết kế đến phát triển cá nhân.

### 🎯 Mục tiêu

- Tạo ra một môi trường học tập trực tuyến chất lượng cao
- Kết nối học viên với các giảng viên có kinh nghiệm
- Hỗ trợ người Việt Nam tiếp cận kiến thức một cách dễ dàng và hiệu quả
- Xây dựng cộng đồng học tập tương tác và hỗ trợ lẫn nhau

---

## ✨ Tính năng chính

### 👨‍🎓 Dành cho Học viên

- **📚 Khóa học đa dạng**: Hàng nghìn khóa học chất lượng cao
- **🤖 Gợi ý khóa học bằng AI**: Hệ thống AI phân tích hành vi học tập và gợi ý khóa học phù hợp
- **🎥 Video học tập**: Hỗ trợ streaming video mượt mà
- **📝 Bài tập & Quiz**: Hệ thống đánh giá tiến độ học tập
- **💬 Thảo luận**: Tương tác với giảng viên và học viên khác
- **🏆 Chứng chỉ**: Nhận chứng chỉ hoàn thành khóa học
- **❤️ Yêu thích**: Lưu các khóa học quan tâm
- **🎮 Gamification**: Tích lũy điểm, huy hiệu, và xếp hạng khi hoàn thành bài học 
- **🛒 Giỏ hàng**: Mua nhiều khóa học cùng lúc

### 👨‍🏫 Dành cho Giảng viên

- **🎬 Tạo khóa học**: Công cụ tạo nội dung dễ sử dụng
- **📊 Phân tích**: Theo dõi hiệu suất khóa học
- **💰 Thu nhập**: Hệ thống thanh toán PayPal tích hợp
- **👥 Quản lý học viên**: Theo dõi tiến độ học tập
- **🎯 Marketing**: Công cụ tạo voucher giảm giá

### 🔧 Dành cho Quản trị viên

- **🏢 Quản lý hệ thống**: Dashboard tổng quan
- **✅ Duyệt khóa học**: Kiểm soát chất lượng nội dung
- **🤖 AI Monitoring**: Theo dõi và tinh chỉnh thuật toán gợi ý 
- **👤 Quản lý người dùng**: Hệ thống phân quyền
- **📈 Báo cáo**: Thống kê chi tiết

---

## 🛠 Công nghệ sử dụng

### Frontend (FE-EduLink)

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Hook Form + Zustand
- **HTTP Client**: Axios
- **UI Components**: Radix UI, Lucide React
- **Notifications**: React Hot Toast

### Backend (BE-EduLink)

- **Framework**: NestJS 11.1.0
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **File Upload**: Cloudinary
- **Cache**: Redis
- **Search**: Elasticsearch
- **Payment**: PayPal SDK
- **Email**: Nodemailer

### DevOps & Tools

- **Container**: Docker & Docker Compose
- **Database Migration**: Prisma Migrate
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest

---

## 📁 Cấu trúc dự án

```
EduLink/
├── 📁 BE-EduLink/                 # Backend NestJS
│   ├── 📁 src/
│   │   ├── 📁 auth/               # Authentication module
│   │   ├── 📁 courses/            # Course management
│   │   ├── 📁 users/              # User management
│   │   ├── 📁 payments/           # Payment processing
│   │   ├── 📁 upload/             # File upload service
│   │   └── 📁 common/             # Shared utilities
│   ├── 📁 prisma/                 # Database schema & migrations
│   ├── 📄 docker-compose.yml      # Docker services
│   ├── 📄 package.json
│   └── 📄 README.md
│
├── 📁 FE-EduLink/                 # Frontend Next.js
│   ├── 📁 src/
│   │   ├── 📁 app/                # App Router pages
│   │   ├── 📁 components/         # React components
│   │   ├── 📁 lib/                # Utilities & config
│   │   └── 📁 types/              # TypeScript types
│   ├── 📁 public/                 # Static assets
│   ├── 📄 package.json
│   └── 📄 README.md
│
└── 📄 README.md                   # File này
```

---

## 🔧 Yêu cầu hệ thống

### Software Requirements

- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 8.0.0 hoặc **yarn**: ≥ 1.22.0
- **PostgreSQL**: ≥ 14.0
- **Docker**: ≥ 20.0 (tùy chọn)
- **Git**: Latest version

### Hardware Requirements

- **RAM**: ≥ 8GB (khuyến nghị 16GB)
- **Disk**: ≥ 10GB free space
- **CPU**: Multi-core processor

---

## 🚀 Hướng dẫn cài đặt

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/EduLink.git
cd EduLink
```

### 2️⃣ Cài đặt Backend (BE-EduLink)

```bash
cd BE-EduLink
```

#### Sử dụng Docker (Khuyến nghị) 🐳

1. **Pull và chạy các services cần thiết:**

```bash
# Pull images và start services
docker-compose up -d

# Verify services are running
docker-compose ps
```

2. **Cài đặt dependencies:**

```bash
npm install
```

3. **Cấu hình database:**

```bash
# Copy file cấu hình
cp .env.sample .env

# Chỉnh sửa file .env với thông tin database của bạn
# DATABASE_URL="postgresql://postgres:123456789@localhost:5432/EduLink"

# Tạo database và chạy migrations
npx prisma migrate deploy
npx prisma generate

# Seed data (tùy chọn)
npx prisma db seed
```

#### Cài đặt thủ công (Không dùng Docker)

1. **Cài đặt PostgreSQL, Redis, Elasticsearch:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib redis-server

# macOS với Homebrew
brew install postgresql redis elasticsearch

# Windows: Download và cài đặt từ trang chủ
```

2. **Tạo database:**

```sql
sudo -u postgres psql
CREATE DATABASE EduLink;
CREATE USER EduLink_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE EduLink TO EduLink_user;
\q
```

3. **Cài đặt dependencies và cấu hình:**

```bash
npm install
cp .env.sample .env
# Chỉnh sửa .env file
npx prisma migrate deploy
npx prisma generate
```

### 3️⃣ Cài đặt Frontend (FE-EduLink)

```bash
cd ../FE-EduLink

# Cài đặt dependencies
npm install

# Cấu hình environment
cp .env.sample .env
# Chỉnh sửa NEXT_PUBLIC_API_URL="http://localhost:9090"
```

---

## ⚙️ Cấu hình môi trường

### Backend Environment (.env)

```env
# Server Configuration
PORT=9090

# Database
DATABASE_URL="postgresql://postgres:123456789@localhost:5432/EduLink"

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRATION=7d

# External Services
ELASTICSEARCH_NODE=http://localhost:9200

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600
REDIS_MAX_ITEMS=100

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@EduLink.com

# PayPal Payment
PAYPAL_CLIENT_ID=your-paypal-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-paypal-sandbox-client-secret

# Prisma
PRISMA_MIGRATE_SKIP_SHADOW_DATABASE=true
```

### Frontend Environment (.env)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9090
```

---

## 🏃‍♂️ Chạy ứng dụng

### Development Mode

1. **Start Backend:**

```bash
cd BE-EduLink

# Với Docker
docker-compose up -d

# Start NestJS server
npm run start:dev
```

2. **Start Frontend:**

```bash
cd FE-EduLink

# Start Next.js server
npm run dev
```

3. **Truy cập ứng dụng:**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9090
- **API Documentation**: http://localhost:9090/api/docs
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601
- **Redis**: localhost:6379

### Production Mode

1. **Build Backend:**

```bash
cd BE-EduLink
npm run build
npm run start:prod
```

2. **Build Frontend:**

```bash
cd FE-EduLink
npm run build
npm run start
```

---

## 📚 API Documentation

API documentation được tự động generate bằng Swagger và có thể truy cập tại:

**🔗 http://localhost:9090/api/docs**

### Các endpoint chính:

| Module       | Endpoint          | Mô tả                             |
| ------------ | ----------------- | --------------------------------- |
| **Auth**     | `/api/auth/*`     | Đăng nhập, đăng ký, làm mới token |
| **Users**    | `/api/users/*`    | Quản lý người dùng                |
| **Courses**  | `/api/courses/*`  | Quản lý khóa học                  |
| **Payments** | `/api/payments/*` | Xử lý thanh toán                  |
| **Upload**   | `/api/upload/*`   | Upload file và media              |

---

## 🚀 Deployment

### Docker Deployment

1. **Build images:**

```bash
# Backend
cd BE-EduLink
docker build -t EduLink-backend .

# Frontend
cd ../FE-EduLink
docker build -t EduLink-frontend .
```

2. **Deploy với docker-compose:**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. **Setup server environment**
2. **Configure environment variables**
3. **Setup reverse proxy (Nginx)**
4. **Setup SSL certificates**
5. **Configure process manager (PM2)**

Xem thêm chi tiết tại [Deployment Guide](./docs/deployment.md)

---

## 📊 Monitoring & Logs

### Health Checks

- **Backend**: http://localhost:9090/health
- **Database**: Kiểm tra kết nối Prisma
- **Redis**: Health check endpoint
- **Elasticsearch**: Cluster health API

### Logs

```bash
# Backend logs
cd BE-EduLink
npm run start:dev 2>&1 | tee logs/app.log

# Frontend logs
cd FE-EduLink
npm run dev 2>&1 | tee logs/app.log
```

---

## 🧪 Testing

### Backend Testing

```bash
cd BE-EduLink

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing

```bash
cd FE-EduLink

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng đọc [Contributing Guidelines](./CONTRIBUTING.md) trước khi bắt đầu.

### Quy trình đóng góp:

1. **Fork** repository
2. **Tạo branch** cho feature: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'Add some AmazingFeature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Tạo Pull Request**

### Code Style

- Sử dụng **ESLint** và **Prettier**
- Follow **TypeScript best practices**
- Viết **unit tests** cho các tính năng mới
- Tuân thủ **conventional commits**

---

## 🐛 Báo cáo lỗi

Nếu bạn phát hiện lỗi, vui lòng [tạo issue](https://github.com/your-repo/issues) với thông tin:

- **Mô tả lỗi** chi tiết
- **Các bước tái hiện** lỗi
- **Expected behavior**
- **Screenshots** (nếu có)
- **Environment info** (OS, Node version, etc.)

---

## 📞 Hỗ trợ

- **Email**: support@EduLink.com
- **Discord**: [EduLink Community](#)
- **Documentation**: [docs.EduLink.com](#)
- **FAQ**: [Frequently Asked Questions](#)

---

## 📝 Changelog

Xem [CHANGELOG.md](./CHANGELOG.md) để biết chi tiết về các phiên bản.

---

## 📄 Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 👥 Team

### Core Contributors

- **Project Lead**: [Tên Leader]
- **Backend Lead**: [Tên Backend Lead]
- **Frontend Lead**: [Tên Frontend Lead]
- **DevOps Engineer**: [Tên DevOps]

---

## 🙏 Acknowledgments

- **NestJS Team** - Framework backend tuyệt vời
- **Next.js Team** - Framework frontend hiện đại
- **Vercel** - Platform deployment
- **PostgreSQL** - Database đáng tin cậy
- **Tất cả contributors** - Cảm ơn sự đóng góp!

---

<div align="center">

**⭐ Đừng quên star repository nếu bạn thấy hữu ích! ⭐**

Made with ❤️ by EduLink Team

</div>

# 🚀 Panduan Deploy ke Dokploy - Qosan

## ✅ Testing Local Berhasil!

Aplikasi sudah berhasil ditest di local dengan Docker Compose. Semua services berjalan dengan baik:
- ✅ **Nginx** - Web server
- ✅ **PHP-FPM** - PHP processor
- ✅ **MySQL** - Database
- ✅ **Redis** - Cache & Queue
- ✅ **Queue Workers** - Background jobs (2 workers)
- ✅ **Scheduler** - Cron jobs

## 📋 Persiapan Deploy ke Dokploy

### 1. Push Code ke Git Repository

```bash
git add .
git commit -m "Add Docker deployment configuration for Dokploy"
git push origin main
```

### 2. Login ke Dokploy Dashboard

Akses Dokploy dashboard Anda dan buat aplikasi baru.

### 3. Konfigurasi Aplikasi di Dokploy

#### A. General Settings
- **Name**: `qosan` (atau nama yang Anda inginkan)
- **Deploy Type**: **Docker Compose**
- **Repository**: Pilih Git repository Anda
- **Branch**: `main` (atau branch yang Anda gunakan)

#### B. Environment Variables (WAJIB!)

Tambahkan environment variables berikut di Dokploy:

```env
# Application
APP_NAME=Qosan
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_PORT=8000

# Database
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=qosan
DB_USERNAME=qosan
DB_PASSWORD=GENERATE_STRONG_PASSWORD_HERE
DB_ROOT_PASSWORD=GENERATE_STRONG_ROOT_PASSWORD_HERE

# Redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=redis
REDIS_PASSWORD=GENERATE_STRONG_REDIS_PASSWORD_HERE
REDIS_PORT=6379

# Session
SESSION_LIFETIME=120
SESSION_ENCRYPT=false

# Mail (sesuaikan dengan provider Anda)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@your-domain.com
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=info
```

#### C. Generate APP_KEY

Untuk generate APP_KEY, jalankan di local:
```bash
php artisan key:generate --show
```

Copy hasilnya (format: `base64:...`) dan paste ke environment variable `APP_KEY`.

#### D. Domain Configuration

- Set custom domain Anda (contoh: `qosan.yourdomain.com`)
- Dokploy akan otomatis setup SSL certificate via Let's Encrypt

### 4. Deploy!

Klik tombol **Deploy** dan tunggu proses build selesai (~5-10 menit untuk build pertama).

## 🔍 Monitoring Deployment

### Cek Logs di Dokploy

Dokploy menyediakan real-time logs untuk setiap container:
- **App logs**: Lihat Laravel application logs
- **Database logs**: Monitor MySQL
- **Redis logs**: Monitor cache & queue

### Cek Status Aplikasi

Setelah deployment selesai, akses domain Anda:
```
https://your-domain.com
```

## 🛠️ Post-Deployment Tasks

### 1. Create Admin User (Optional)

Akses terminal di Dokploy dan jalankan:

```bash
# Masuk ke app container
docker exec -it qosan-app sh

# Buka tinker
php artisan tinker

# Create admin user
User::create([
    'name' => 'Admin',
    'email' => 'admin@qosan.com',
    'password' => bcrypt('your_secure_password')
]);
```

### 2. Seed Database (Optional)

Jika ingin seed data sample:

```bash
# Set environment variable
export SEED_DATABASE=true

# Restart container untuk trigger seeding
# Atau manual:
docker exec -it qosan-app php artisan db:seed --force
```

## 🔄 Update & Redeploy

Ketika ada perubahan code:

1. **Push ke Git**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Redeploy di Dokploy**:
   - Klik tombol **Redeploy** di dashboard
   - Atau setup auto-deploy via webhook

## 📊 Resource Requirements

### Minimum
- **CPU**: 1 vCPU
- **RAM**: 1GB
- **Storage**: 10GB

### Recommended (Production)
- **CPU**: 2 vCPU
- **RAM**: 2GB
- **Storage**: 20GB

## 🔐 Security Checklist

- [x] APP_KEY sudah di-generate dan unique
- [x] APP_DEBUG=false di production
- [x] Password database, Redis kuat dan aman
- [x] SSL certificate aktif (via Dokploy)
- [x] Environment variables tidak di-commit ke Git
- [x] Regular backup database

## 🐛 Troubleshooting

### Container Restart Terus

Cek logs di Dokploy untuk error message. Common issues:
- APP_KEY belum di-set
- Database connection failed (cek password)
- Redis connection failed (cek password)

### 500 Internal Server Error

```bash
# Cek Laravel logs
docker exec -it qosan-app tail -f storage/logs/laravel.log

# Clear cache
docker exec -it qosan-app php artisan cache:clear
docker exec -it qosan-app php artisan config:clear
```

### Queue Not Processing

```bash
# Restart queue workers
docker exec -it qosan-app php artisan queue:restart

# Atau restart container
docker restart qosan-app
```

### Database Migration Failed

```bash
# Run migrations manually
docker exec -it qosan-app php artisan migrate --force
```

## 📞 Support

Jika ada masalah:
1. Cek logs di Dokploy dashboard
2. Cek Laravel logs: `storage/logs/laravel.log`
3. Cek Nginx error logs: `/var/log/nginx/error.log`

## 🎉 Selesai!

Aplikasi Qosan Anda sekarang sudah running di production dengan Dokploy! 🚀

---

**Tips**: 
- Setup regular database backup
- Monitor resource usage di Dokploy dashboard
- Enable auto-deploy untuk CI/CD workflow

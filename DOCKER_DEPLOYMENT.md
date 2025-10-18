# 🐳 Docker Deployment Guide - Qosan

Panduan deployment aplikasi Qosan menggunakan Docker Compose untuk Dokploy atau environment production lainnya.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Minimal 2GB RAM
- Minimal 10GB disk space

## 🚀 Quick Start (Local Testing)

### 1. Setup Environment Variables

```bash
# Copy file .env.docker ke .env
cp .env.docker .env

# Edit .env dan sesuaikan konfigurasi
nano .env
```

**PENTING**: Generate APP_KEY baru:
```bash
# Jika sudah punya PHP dan Composer di local
php artisan key:generate

# Atau generate manual (base64 encoded 32 character string)
# Contoh: base64:abcdefghijklmnopqrstuvwxyz123456
```

### 2. Update Password di .env

Ganti password berikut dengan password yang aman:
- `DB_PASSWORD` - Password database MySQL
- `DB_ROOT_PASSWORD` - Root password MySQL
- `REDIS_PASSWORD` - Password Redis

### 3. Build dan Jalankan Container

```bash
# Build image
docker-compose build

# Jalankan semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f app
```

### 4. Akses Aplikasi

Buka browser: `http://localhost:8000`

## 🔧 Konfigurasi untuk Dokploy

### 1. Upload Project ke Git Repository

Pastikan semua file Docker sudah di-commit:
```bash
git add .
git commit -m "Add Docker deployment configuration"
git push
```

### 2. Setup di Dokploy

1. **Create New Application**
   - Pilih "Docker Compose"
   - Connect ke Git repository Anda

2. **Environment Variables**
   - Copy semua variable dari `.env.docker`
   - **WAJIB** set variable berikut:
     - `APP_KEY` (generate dengan `php artisan key:generate`)
     - `APP_URL` (URL production Anda)
     - `DB_PASSWORD` (password database yang aman)
     - `DB_ROOT_PASSWORD` (root password yang aman)
     - `REDIS_PASSWORD` (password redis yang aman)

3. **Domain Configuration**
   - Set domain Anda (contoh: `qosan.yourdomain.com`)
   - Dokploy akan handle SSL certificate otomatis

4. **Deploy**
   - Klik "Deploy"
   - Tunggu build process selesai (~5-10 menit)

### 3. Post-Deployment

Setelah deployment berhasil, jalankan command berikut via Dokploy terminal:

```bash
# Masuk ke container
docker exec -it qosan-app sh

# (Optional) Seed database dengan data awal
php artisan db:seed

# (Optional) Create admin user
php artisan tinker
# Kemudian jalankan:
# User::create(['name' => 'Admin', 'email' => 'admin@qosan.com', 'password' => bcrypt('password')]);
```

## 📦 Services

Docker Compose setup ini menggunakan 3 services:

### 1. **app** - Laravel Application
- PHP 8.2 FPM
- Nginx web server
- Queue workers (2 processes)
- Scheduler
- Port: 8000 (default)

### 2. **db** - MySQL Database
- MySQL 8.0
- Persistent volume untuk data
- Port: 3306 (internal)

### 3. **redis** - Cache & Queue
- Redis 7 Alpine
- Persistent volume untuk data
- Port: 6379 (internal)

## 🔍 Monitoring & Debugging

### Lihat Logs

```bash
# Semua services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis

# Laravel logs
docker exec -it qosan-app tail -f storage/logs/laravel.log

# Queue worker logs
docker exec -it qosan-app tail -f storage/logs/worker.log
```

### Masuk ke Container

```bash
# Masuk ke app container
docker exec -it qosan-app sh

# Jalankan artisan commands
docker exec -it qosan-app php artisan migrate
docker exec -it qosan-app php artisan cache:clear
docker exec -it qosan-app php artisan queue:restart
```

### Database Access

```bash
# Masuk ke MySQL
docker exec -it qosan-db mysql -u qosan -p

# Backup database
docker exec qosan-db mysqldump -u qosan -p qosan > backup.sql

# Restore database
docker exec -i qosan-db mysql -u qosan -p qosan < backup.sql
```

## 🔄 Update & Redeploy

### Update Code

```bash
# Pull latest code
git pull

# Rebuild dan restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run migrations
docker exec -it qosan-app php artisan migrate --force
```

### Update Dependencies

Jika ada perubahan di `composer.json` atau `package.json`:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 🛡️ Security Checklist

- [ ] Generate APP_KEY yang unik
- [ ] Set APP_DEBUG=false di production
- [ ] Gunakan password yang kuat untuk DB dan Redis
- [ ] Set APP_ENV=production
- [ ] Configure proper mail settings
- [ ] Setup SSL certificate (Dokploy handle otomatis)
- [ ] Regular backup database
- [ ] Monitor logs untuk suspicious activity

## 🗂️ Volumes & Data Persistence

Data yang persistent (tidak hilang saat restart):
- `db-data`: MySQL database files
- `redis-data`: Redis persistence files
- `storage-data`: Uploaded files (images, documents)

### Backup Volumes

```bash
# Backup storage data
docker run --rm -v qosan_storage-data:/data -v $(pwd):/backup alpine tar czf /backup/storage-backup.tar.gz /data

# Restore storage data
docker run --rm -v qosan_storage-data:/data -v $(pwd):/backup alpine tar xzf /backup/storage-backup.tar.gz -C /
```

## 🐛 Troubleshooting

### Container tidak start
```bash
docker-compose logs app
docker-compose ps
```

### Permission errors
```bash
docker exec -it qosan-app chown -R www-data:www-data /var/www/html/storage
docker exec -it qosan-app chmod -R 775 /var/www/html/storage
```

### Database connection failed
- Pastikan DB_HOST=db (bukan localhost)
- Cek password di .env
- Tunggu database ready: `docker-compose logs db`

### Queue not processing
```bash
docker exec -it qosan-app php artisan queue:restart
docker-compose restart app
```

## 📞 Support

Jika ada masalah, cek:
1. Docker logs: `docker-compose logs -f`
2. Laravel logs: `storage/logs/laravel.log`
3. Nginx error logs: `/var/log/nginx/error.log`

## 📝 Notes

- Build time pertama ~5-10 menit (download images + install dependencies)
- Subsequent builds lebih cepat karena Docker cache
- Production image size ~500MB (optimized)
- Memory usage: ~500MB-1GB (tergantung traffic)

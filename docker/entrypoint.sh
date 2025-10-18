#!/bin/sh
set -e

echo "Starting Qosan Application..."

# Wait for database to be ready
if [ "$DB_CONNECTION" = "mysql" ]; then
    echo "Waiting for MySQL to be ready..."
    until nc -z -v -w30 $DB_HOST $DB_PORT
    do
        echo "Waiting for database connection..."
        sleep 2
    done
    echo "MySQL is ready!"
fi

# Wait for Redis to be ready
if [ "$REDIS_HOST" != "" ]; then
    echo "Waiting for Redis to be ready..."
    until nc -z -v -w30 $REDIS_HOST $REDIS_PORT
    do
        echo "Waiting for Redis connection..."
        sleep 2
    done
    echo "Redis is ready!"
fi

# Create necessary directories
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/log/supervisor

# Set permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Run Laravel setup commands
echo "Running Laravel setup..."

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Run migrations
echo "Running database migrations..."
php artisan migrate --force --no-interaction

# Seed database only if APP_ENV is not production or if SEED_DATABASE is set
if [ "$APP_ENV" != "production" ] || [ "$SEED_DATABASE" = "true" ]; then
    echo "Seeding database..."
    php artisan db:seed --force --no-interaction || echo "Seeding skipped or failed"
fi

# Create storage link if not exists
if [ ! -L /var/www/html/public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Optimize application
php artisan optimize

echo "Application setup completed!"

# Execute the main command
exec "$@"

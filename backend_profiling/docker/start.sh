#!/bin/sh
set -e

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# Cache config and routes for production
php artisan config:cache
php artisan route:cache

# Run migrations
php artisan migrate --force

# Substitute PORT in nginx config (Render injects $PORT dynamically)
LISTEN_PORT="${PORT:-8000}"
sed -i "s/LISTEN_PORT_PLACEHOLDER/$LISTEN_PORT/g" /etc/nginx/nginx.conf

# Start PHP-FPM in background
php-fpm
sleep 2

# Verify php-fpm is running
if [ ! -f /var/run/php-fpm.pid ] && ! pgrep -x php-fpm > /dev/null 2>&1; then
  echo "ERROR: php-fpm failed to start"
  exit 1
fi

echo "php-fpm started, launching nginx on port $LISTEN_PORT"

# Start nginx in foreground
exec nginx -g "daemon off;"

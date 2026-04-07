#!/bin/sh
set -e

# APP_KEY must be set via environment variable on Render
if [ -z "$APP_KEY" ]; then
  echo "ERROR: APP_KEY environment variable is not set"
  exit 1
fi

# Cache config and routes for production
php artisan config:cache
php artisan route:cache

# Run migrations
php artisan migrate --force

# Render injects $PORT dynamically — default to 8000 locally
LISTEN_PORT="${PORT:-8000}"
echo "Using port: $LISTEN_PORT"

# Write nginx config — use quoted 'EOF' so shell does NOT expand anything inside
# Then substitute only LISTEN_PORT after writing
cat > /etc/nginx/nginx.conf << 'EOF'
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;

    server {
        listen LISTEN_PORT_PLACEHOLDER;
        root /var/www/html/public;
        index index.php;

        client_max_body_size 20M;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_read_timeout 300;
        }

        location ~ /\.ht {
            deny all;
        }
    }
}
EOF

# Now substitute the port (only our placeholder, not nginx variables)
sed -i "s/LISTEN_PORT_PLACEHOLDER/$LISTEN_PORT/" /etc/nginx/nginx.conf

# Validate nginx config
nginx -t

# Start PHP-FPM in background
php-fpm
sleep 2

# Verify php-fpm is running
if ! pgrep -x php-fpm > /dev/null 2>&1; then
  echo "ERROR: php-fpm failed to start"
  exit 1
fi

echo "php-fpm running, starting nginx on port $LISTEN_PORT"

# Start nginx in foreground
exec nginx -g "daemon off;"

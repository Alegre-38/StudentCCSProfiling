FROM richarvey/nginx-php-fpm:3.1.6

# Cache bust - forces fresh build when CORS or config changes
ARG CACHE_BUST=3

COPY . .

# Copy custom nginx config to the correct location for richarvey image
COPY conf/nginx/nginx-site.conf /etc/nginx/sites-available/default.conf
RUN ln -sf /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default.conf

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Fix permissions for Laravel writable directories
RUN chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV NGINX_SITE_CONF /etc/nginx/sites-available/default.conf

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]

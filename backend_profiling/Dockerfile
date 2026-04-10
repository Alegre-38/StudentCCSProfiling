FROM richarvey/nginx-php-fpm:3.1.6

COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Find the actual php-fpm socket path
RUN find /var/run -name "*.sock" 2>/dev/null || echo "no sockets in /var/run" && \
    cat /etc/php*/php-fpm.d/www.conf 2>/dev/null | grep "^listen" || echo "checking fpm config" && \
    cat /usr/local/etc/php-fpm.d/www.conf 2>/dev/null | grep "^listen" || true

# Fix permissions for Laravel writable directories
RUN chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache
# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]

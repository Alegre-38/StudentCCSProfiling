#!/usr/bin/env bash
echo "Running composer"
composer install --no-dev --working-dir=/var/www/html

echo "Clearing all caches..."
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Seeding admin..."
php artisan db:seed --class=AdminSeeder --force

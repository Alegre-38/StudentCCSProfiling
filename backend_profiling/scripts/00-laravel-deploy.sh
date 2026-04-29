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

echo "Seeding students (only if fewer than 1000 exist)..."
STUDENT_COUNT=$(php artisan tinker --no-interaction --execute="echo \App\Models\StudentDemographic::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
echo "Current student count: $STUDENT_COUNT"
if [ "$STUDENT_COUNT" -lt 1000 ] 2>/dev/null; then
    echo "Running StudentSeeder in background..."
    (php artisan db:seed --class=StudentSeeder --force >> /tmp/student-seed.log 2>&1 &)
    echo "StudentSeeder running in background, check /tmp/student-seed.log"
else
    echo "Already have $STUDENT_COUNT students, skipping seeder."
fi

echo "Seeding faculty (only if fewer than 100 exist)..."
FACULTY_COUNT=$(php artisan tinker --no-interaction --execute="echo \App\Models\FacultyCore::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
echo "Current faculty count: $FACULTY_COUNT"
if [ "$FACULTY_COUNT" -lt 100 ] 2>/dev/null; then
    echo "Running FacultySeeder in background..."
    (php artisan db:seed --class=FacultySeeder --force >> /tmp/faculty-seed.log 2>&1 &)
    echo "FacultySeeder running in background."
else
    echo "Already have $FACULTY_COUNT faculty, skipping seeder."
fi

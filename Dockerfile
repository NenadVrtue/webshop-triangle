FROM php:8.2-cli

# Instaliraj sistemske pakete i PHP ekstenzije
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instaliraj Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Instaliraj Node.js (za React/Inertia build)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Postavi radni direktorij
WORKDIR /var/www/html

# Kopiraj projekt
COPY . .

# Instaliraj PHP dependency
RUN composer install --no-interaction --prefer-dist

# Instaliraj JS dependency i buildaj frontend
RUN npm install && npm run build

# Laravel optimizacija (samo za production)
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expose HTTP port
EXPOSE 8000

# Pokreni Laravel built-in server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

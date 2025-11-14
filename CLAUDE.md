# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel-based tire e-commerce platform with WooCommerce integration. The application uses Inertia.js to bridge Laravel backend with a React frontend, providing a modern SPA experience while maintaining server-side routing.

## Technology Stack

- **Backend**: Laravel 12.0 (PHP 8.2+)
- **Frontend**: React 19.0 with TypeScript 5.7
- **Bridge**: Inertia.js 2.0
- **Styling**: Tailwind CSS 4.0 with Radix UI components
- **Testing**: Pest 3.8
- **Build**: Vite 6.0
- **Queue**: Laravel Queue (sync in dev, configure for production)
- **External**: WooCommerce API v3 for product synchronization

## Development Commands

### Initial Setup
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

### Development Server
```bash
# Standard development (runs server + queue + vite concurrently)
composer dev

# Development with SSR support
composer dev:ssr
```

### Testing
```bash
# Run all tests
composer test
# or
./vendor/bin/pest

# Run specific test file
./vendor/bin/pest tests/Feature/Auth/AuthenticationTest.php
```

### Code Quality
```bash
# PHP code style (Laravel Pint)
vendor/bin/pint

# Frontend formatting (Prettier)
npm run format
npm run format:check

# Frontend linting (ESLint)
npm run lint

# TypeScript type checking
npm run types
```

### Build
```bash
# Build for production
npm run build

# Build with SSR
npm run build:ssr
```

### WooCommerce Sync Commands
```bash
# Import tires from CSV
php artisan app:import-tires-from-csv

# Sync tire images from WooCommerce
php artisan app:sync-tire-images-from-woo

# Dispatch WooCommerce sync job
php artisan tinker
>>> dispatch(new App\Jobs\SyncTiresToWoo());
```

## Architecture

### Role-Based Access Control

Three user roles defined in `App\Enums\Role`:
- **User (0)**: Standard customers - can browse, order, view own orders
- **Admin (1)**: Full access - manage users, orders, discounts, promo codes, tire inventory
- **Sales (2)**: Order management - view orders, update statuses

Routes are protected by `role:admin` or `role:sales` middleware (see `App\Http\Middleware\EnsureUserHasRole`).

### Core Models & Relationships

**User**
- Has many `Order`s
- Has many `Discount`s (per-user discounts)
- Belongs to many `PromoCode`s (usage tracking)

**Tire**
- Core product entity with extensive tire specifications (width, height, season, brand, catalog)
- Pricing tiers: `nabavna_cijena` (cost), `mp_cijena` (retail), `vp_cijena` (wholesale)
- Stock tracking: `kolicina_na_stanju`
- WooCommerce sync: `image_url`, `eprel_code` (EU tire label)

**Order**
- Belongs to `User`
- Has many `OrderItem`s
- Tracks customer info, shipping details, financial totals

**Discount**
- Scopes: `app_wide` or `per_user`
- Category-based filtering: `tire_kategorija`
- Percentage-based discounts

**PromoCode**
- Time-limited promotional codes
- Many-to-many with `User` for usage tracking
- Expiration date enforcement

### WooCommerce Integration

**Service Layer**: `App\Services\WooService`
- Wraps Automattic WooCommerce API client
- Methods: `createProduct()`, `updateProduct()`, `findBySku()`, `findById()`
- Configuration in `config/services.php` (url, key, secret)

**Sync Job**: `App\Jobs\SyncTiresToWoo`
- Queued job implementing `ShouldQueue`
- Batches tires in chunks of 100 to prevent memory issues
- Retry strategy: 3 attempts with backoff (60s, 300s)
- Syncs SKU, pricing, stock quantity, and metadata to WooCommerce

**Important**: WooCommerce config requires `WOOCOMMERCE_URL`, `WOOCOMMERCE_KEY`, and `WOOCOMMERCE_SECRET` in `.env`.

### Frontend Architecture (Inertia.js)

**Entry Points**:
- `resources/js/app.tsx` - Client-side entry
- `resources/js/ssr.tsx` - Server-side rendering entry

**Page Components**: Located in `resources/js/pages/`
- Server renders initial page
- Subsequent navigation happens client-side via Inertia
- Props passed from Laravel controllers to React components

**Shared Components**:
- `resources/js/components/ui/` - Radix UI wrappers styled with Tailwind
- `resources/js/components/table/` - TanStack Table components for data grids
- `resources/js/components/cart/` - Shopping cart components

**State Management**:
- Inertia handles page state (no Redux/Zustand needed)
- Server-driven state via Laravel controller props
- Local state with React hooks

### Route Organization

**Web Routes** (`routes/web.php`):
- Public: `/` (home), `/contact`
- Auth required: `/dashboard`, `/checkout`, `/orders`
- Admin prefix: `/admin/*`
- Sales prefix: `/sales/*`

**API Routes** (`routes/api.php`):
- Public: `GET /api/tires`
- Admin: Full CRUD for users, discounts, promo codes
- Auth: Orders, logout

**Auth Routes** (`routes/auth.php`):
- Login, register, password reset, email verification

**Settings Routes** (`routes/settings.php`):
- User profile, password updates

## Key Development Patterns

### Adding New Features

1. **Backend-first approach**: Create controller action, define route
2. **Inertia response**: Return `Inertia::render('PageName', $props)`
3. **React page**: Create page component in `resources/js/pages/`
4. **TypeScript types**: Define prop types for type safety
5. **UI components**: Use existing Radix UI wrappers from `components/ui/`

### Database Migrations

- Migrations are timestamped in `database/migrations/`
- Run `php artisan migrate` for new migrations
- Use `php artisan make:migration` to create new ones

### Testing Pattern

- Feature tests for HTTP requests/responses
- Unit tests for model logic and services
- Use `RefreshDatabase` trait to reset database between tests
- SQLite in-memory database for fast test execution

### Code Style

- **PHP**: Laravel conventions, PSR-4 autoloading
- **TypeScript/React**: Functional components, hooks pattern
- **Formatting**: Prettier handles imports organization, Tailwind class sorting
- **Linting**: ESLint enforces React best practices

## CI/CD

GitHub Actions workflows in `.github/workflows/`:

**tests.yml**: Runs on push/PR to `develop` and `main`
- PHP 8.4, Node 22
- Installs dependencies, builds assets
- Runs Pest test suite

**lint.yml**: Code quality checks
- Runs Laravel Pint (PHP)
- Runs Prettier (frontend)
- Runs ESLint (frontend)

## Environment Configuration

Critical `.env` variables:
- `APP_URL` - Application URL
- `DB_*` - Database credentials (SQLite for dev, MySQL for production)
- `MAIL_*` - Email service configuration
- `WOOCOMMERCE_URL` - WooCommerce store URL (without /wp-json)
- `WOOCOMMERCE_KEY` - WooCommerce REST API consumer key
- `WOOCOMMERCE_SECRET` - WooCommerce REST API consumer secret
- `QUEUE_CONNECTION` - Set to `database` or `redis` in production (currently `sync`)

## Important Notes

### WooCommerce Sync
- SKU (`sifra` column) is the unique identifier for product matching
- Sync updates pricing, stock, and metadata only (not product name/description)
- Images are synced separately via `SyncTireImagesFromWoo` command
- Large syncs should be queued and monitored via logs

### Inertia.js Gotchas
- Page components must be in `resources/js/pages/` to be auto-discovered
- Props passed from controller are typed in TypeScript page components
- Form submissions use Inertia's form helpers, not native fetch/axios
- Redirects after POST must use `Inertia::location()` or return redirect response

### Styling
- Tailwind 4.0 uses new Vite plugin approach (no PostCSS needed)
- Global styles in `resources/css/app.css`
- Radix UI components are headless - styling done via Tailwind classes
- Theme switching (dark/light) via `next-themes` provider

### Queue System
- Development uses `sync` driver (runs immediately)
- Production should use `database` or `redis` driver
- Run `php artisan queue:listen` to process jobs
- `SyncTiresToWoo` job should be monitored for failures

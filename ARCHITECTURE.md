# E-Commerce Application Architecture

## Overview

This is a full-stack e-commerce application with a Node.js/Express backend and Angular frontend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Angular Frontend (Port 4200)                 │ │
│  │  - Standalone Components                               │ │
│  │  - Services (HTTP clients)                            │ │
│  │  - Routing & Navigation                               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                    HTTP/REST API (CORS enabled)
                             │
┌─────────────────────────────────────────────────────────────┐
│                        Server Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Express Backend (Port 3000)                    │ │
│  │  - TypeScript                                          │ │
│  │  - Session Management                                  │ │
│  │  - Authentication Middleware                           │ │
│  │  - REST API Routes                                     │ │
│  │  - Nodemailer Integration                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             │
                      Prisma ORM Layer
                             │
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         PostgreSQL (Port 5432)                         │ │
│  │  - Users                                               │ │
│  │  - Products                                            │ │
│  │  - Orders                                              │ │
│  │  - OrderItems                                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Routes & Endpoints

```
/api
├── /auth
│   ├── POST   /register      - Register new user
│   ├── POST   /login         - Login user
│   ├── POST   /logout        - Logout user
│   └── GET    /me            - Get current user
│
├── /products
│   ├── GET    /              - List all products
│   └── GET    /:id           - Get product by ID
│
├── /cart (Session-based)
│   ├── GET    /              - Get cart
│   ├── POST   /add           - Add item to cart
│   ├── PUT    /update        - Update cart item
│   ├── DELETE /remove/:id    - Remove item from cart
│   └── DELETE /clear         - Clear cart
│
├── /orders (Requires Auth)
│   ├── GET    /              - Get user's orders
│   ├── GET    /:id           - Get order by ID
│   └── POST   /checkout      - Create order from cart
│
└── /admin (Requires Admin)
    ├── GET    /users         - List all users
    ├── PUT    /users/:id     - Update user
    ├── DELETE /users/:id     - Delete user
    ├── GET    /products      - List all products
    ├── POST   /products      - Create product
    ├── PUT    /products/:id  - Update product
    ├── DELETE /products/:id  - Delete product
    ├── GET    /orders        - List all orders
    ├── GET    /orders/:id    - Get order by ID
    ├── PUT    /orders/:id    - Update order status
    └── GET    /stats         - Get statistics
```

### Database Schema

```sql
User
├── id              (INT, Primary Key)
├── email           (STRING, Unique)
├── password        (STRING, Hashed)
├── firstName       (STRING)
├── lastName        (STRING)
├── isAdmin         (BOOLEAN)
├── createdAt       (DATETIME)
└── updatedAt       (DATETIME)

Product
├── id              (INT, Primary Key)
├── name            (STRING)
├── description     (STRING)
├── price           (FLOAT)
├── stock           (INT)
├── imageUrl        (STRING, Optional)
├── createdAt       (DATETIME)
└── updatedAt       (DATETIME)

Order
├── id              (INT, Primary Key)
├── userId          (INT, Foreign Key -> User)
├── status          (STRING)
├── total           (FLOAT)
├── createdAt       (DATETIME)
└── updatedAt       (DATETIME)

OrderItem
├── id              (INT, Primary Key)
├── orderId         (INT, Foreign Key -> Order)
├── productId       (INT, Foreign Key -> Product)
├── quantity        (INT)
├── price           (FLOAT)
└── createdAt       (DATETIME)
```

## Frontend Architecture

### Component Structure

```
app/
├── components/
│   ├── login/              - User login page
│   ├── register/           - User registration page
│   ├── products/           - Product catalog grid
│   ├── product-detail/     - Single product view
│   ├── cart/               - Shopping cart page
│   ├── checkout/           - Checkout confirmation
│   ├── orders/             - User order history
│   ├── admin-dashboard/    - Admin statistics dashboard
│   ├── admin-users/        - Admin user management
│   ├── admin-products/     - Admin product management
│   └── admin-orders/       - Admin order management
│
├── services/
│   ├── auth.ts            - Authentication service
│   ├── product.ts         - Product service
│   ├── cart.ts            - Cart service
│   ├── order.ts           - Order service
│   └── admin.ts           - Admin service
│
├── app.routes.ts          - Application routing
├── app.config.ts          - App configuration
└── app.ts                 - Root component with navigation
```

### User Flow

```
┌─────────────┐
│   Landing   │
│   (/)       │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
   ┌───▼────┐   ┌───▼─────┐
   │ Login  │   │Register │
   └───┬────┘   └───┬─────┘
       │            │
       └──────┬─────┘
              │
       ┌──────▼──────┐
       │  Products   │
       │   Catalog   │
       └──────┬──────┘
              │
       ┌──────▼──────────┐
       │ Product Detail  │
       │ (Add to Cart)   │
       └──────┬──────────┘
              │
       ┌──────▼──────┐
       │ Shopping    │
       │   Cart      │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │  Checkout   │
       └──────┬──────┘
              │
       ┌──────▼──────┐
       │   Orders    │
       │  (History)  │
       └─────────────┘
```

### Admin Flow

```
┌─────────────┐
│Admin Login  │
│(isAdmin=true)│
└──────┬──────┘
       │
┌──────▼─────────┐
│    Admin       │
│  Dashboard     │
│  (Statistics)  │
└──────┬─────────┘
       │
       ├─────────────┬──────────────┐
       │             │              │
┌──────▼──────┐ ┌───▼────────┐ ┌──▼──────────┐
│   Manage    │ │  Manage    │ │   Manage    │
│   Users     │ │  Products  │ │   Orders    │
│             │ │            │ │             │
│- View       │ │- Create    │ │- View       │
│- Edit       │ │- Edit      │ │- Update     │
│- Delete     │ │- Delete    │ │  Status     │
└─────────────┘ └────────────┘ └─────────────┘
```

## Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **Session Management**: express-session with secure cookies
3. **Authentication Middleware**: Protected routes require login
4. **Admin Authorization**: Admin routes require admin flag
5. **CORS Configuration**: Restricted to frontend origin
6. **SQL Injection Protection**: Prisma ORM parameterized queries

## Data Flow Example: Placing an Order

```
1. User adds products to cart (stored in session)
   Frontend -> POST /api/cart/add -> Session Storage

2. User navigates to checkout
   Frontend -> GET /api/cart -> Display cart items

3. User confirms order
   Frontend -> POST /api/orders/checkout
   Backend:
     - Validates cart items
     - Fetches product details from DB
     - Calculates total
     - Creates Order record
     - Creates OrderItem records
     - Updates product stock
     - Sends email notification
     - Clears cart session
   Backend -> Returns order confirmation

4. User views order history
   Frontend -> GET /api/orders -> Display orders
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: express-session + bcryptjs
- **Email**: Nodemailer
- **CORS**: cors middleware

### Frontend
- **Framework**: Angular 19
- **Language**: TypeScript
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: RxJS (Services with BehaviorSubject)
- **Forms**: Angular Forms (Template-driven)

### DevOps
- **Database**: Docker Compose
- **Build Tools**: TypeScript Compiler, Angular CLI
- **Package Manager**: npm

## Performance Considerations

1. **Database Indexing**: Prisma auto-indexes primary and foreign keys
2. **Session Storage**: In-memory sessions (use Redis in production)
3. **Image Hosting**: External URLs to avoid server load
4. **Pagination**: Not implemented (suitable for <20 products)
5. **Caching**: Not implemented (can add Redis layer)

## Scalability Notes

For production deployment:

1. Use external session store (Redis)
2. Implement rate limiting
3. Add caching layer
4. Use environment-specific configurations
5. Set up HTTPS/SSL
6. Implement logging and monitoring
7. Add input validation and sanitization
8. Implement file upload for product images
9. Add pagination for large datasets
10. Use CDN for static assets

## Deployment Checklist

- [ ] Set strong SESSION_SECRET
- [ ] Configure production database
- [ ] Set up email service credentials
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Optimize build for production

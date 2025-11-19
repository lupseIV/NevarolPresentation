# NevarolPresentation - E-Commerce Application

A full-stack e-commerce application built with Node.js, Express, PostgreSQL, Prisma ORM, and Angular.

## Features

### User Features
- User registration and authentication
- Browse products catalog
- Add products to shopping cart (session-based)
- Checkout and place orders
- View order history
- Email notifications for orders

### Admin Features
- Admin dashboard with statistics
- User management (view, edit, delete users)
- Product management (create, edit, delete products)
- Order management (view orders, update status, view invoices/receipts)
- View all users, products, and orders

## Tech Stack

### Backend
- **Node.js** with **Express** - REST API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database ORM and migrations
- **express-session** - Session management for cart
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications
- **CORS** - Cross-origin resource sharing

### Frontend
- **Angular 19** - Modern web framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Standalone components** - Modern Angular architecture

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth middleware
│   │   └── utils/           # Utilities (Prisma, email)
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/  # Angular components
│   │       └── services/    # Angular services
│   ├── package.json
│   └── angular.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

> **⚠️ Important:** Before running the application, you must create a `.env` file in the `backend` directory by copying `.env.example`. This file contains the database credentials required for Prisma to connect to PostgreSQL. The automated setup script (`setup.sh`) handles this for you, or you can do it manually: `cp backend/.env.example backend/.env`

## Installation & Setup

### Quick Setup (Automated)

The repository includes a `setup.sh` script that automates the entire setup process:

```bash
# Make sure Docker and Node.js are installed first
chmod +x setup.sh
./setup.sh
```

The script will:
1. Start PostgreSQL database using Docker Compose
2. Wait for the database to be fully ready (30-60 seconds on first run)
3. **Create `.env` file from `.env.example` (contains database credentials)**
4. Setup backend dependencies and run migrations
5. Setup frontend dependencies
6. Seed the database with sample data

### Manual Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NevarolPresentation
```

### 2. Database Setup (Using Docker - Recommended)

The easiest way to set up PostgreSQL is using Docker Compose:

```bash
# Start PostgreSQL database (Docker Compose v2)
docker compose up -d

# OR with Docker Compose v1
docker-compose up -d

# Wait for database to be ready (important!)
# On first startup, PostgreSQL needs time to initialize
docker compose exec postgres pg_isready -U ecommerce
# OR: docker-compose exec postgres pg_isready -U ecommerce

# Verify database is running
docker ps
```

**Note:** The database may take 30-60 seconds to be fully ready on first startup. Make sure to wait for it before running migrations. The `setup.sh` script handles this automatically.

Alternatively, install PostgreSQL manually on your system.

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from .env.example (if it doesn't exist)
# The .env.example file is already configured for docker-compose setup
cp .env.example .env

# If you're using a different database, edit .env with your credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
# SESSION_SECRET="your-secret-key"
# EMAIL_HOST="smtp.gmail.com"
# EMAIL_PORT="587"
# EMAIL_USER="your-email@gmail.com"
# EMAIL_PASS="your-app-password"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data (admin user + products)
npm run seed
```

**Default Users Created by Seed:**
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
ng serve
# App runs on http://localhost:4200
```

### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
ng build
# Serve the dist/ folder with a web server
```

## Database Schema

### User
- id, email, password (hashed), firstName, lastName, isAdmin, createdAt, updatedAt

### Product
- id, name, description, price, stock, imageUrl, createdAt, updatedAt

### Order
- id, userId, status, total, createdAt, updatedAt

### OrderItem
- id, orderId, productId, quantity, price, createdAt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart (Session-based)
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/checkout` - Create order from cart

### Admin (Requires admin authentication)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get single order
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/stats` - Get statistics

## Default Admin Account

After setting up the database, you'll need to create an admin user. Use Prisma Studio:

```bash
cd backend
npm run prisma:studio
```

1. Create a new User
2. Set `isAdmin` to `true`
3. Use bcrypt to hash a password (or use the registration endpoint and manually update the user in the database)

## Email Configuration

For email notifications to work, configure your email provider in `.env`:

**Gmail Example:**
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the app password in `EMAIL_PASS`

## Sample Products

The seed script (`npm run seed`) creates 12 sample products:

1. Laptop Pro - $1,299.99
2. Wireless Mouse - $29.99
3. Mechanical Keyboard - $89.99
4. USB-C Hub - $49.99
5. Webcam HD - $79.99
6. Headphones - $199.99
7. Monitor 27" - $399.99
8. Desk Lamp - $34.99
9. External SSD 1TB - $129.99
10. Phone Stand - $19.99
11. Wireless Charger - $24.99
12. Laptop Sleeve - $22.99

You can also add more products via the admin panel or Prisma Studio.

## Features Implemented

✅ User authentication and registration  
✅ Session-based shopping cart  
✅ Product catalog with <20 products support  
✅ Order placement and history  
✅ Email notifications via Nodemailer  
✅ Admin panel for managing users  
✅ Admin panel for managing products  
✅ Admin panel for managing orders  
✅ Invoices/receipts viewable in order details  
✅ PostgreSQL database with Prisma ORM  
✅ REST API with Express  
✅ Angular frontend with routing  
✅ Responsive UI design  

## Development Notes

- The application uses session-based authentication
- Cart is stored in server sessions
- All passwords are hashed with bcryptjs
- CORS is configured for localhost:4200
- Database migrations are managed by Prisma

## Troubleshooting

**Database authentication errors (P1000):**
- **Most common cause**: Missing `.env` file in the `backend` directory
  - Create it from `.env.example`: `cp backend/.env.example backend/.env`
  - The `.env` file contains database credentials and is required for Prisma to connect
- The database may not be ready yet after `docker-compose up -d`
  - PostgreSQL needs 30-60 seconds to initialize on first startup
  - Use the `setup.sh` script which properly waits for database readiness
  - Or manually wait: `docker-compose exec postgres pg_isready -U ecommerce`
- Ensure Docker container is running: `docker ps`

**Prisma generate errors (Missing DATABASE_URL):**
- Ensure you have created a `.env` file in the `backend` directory
- Copy from `.env.example`: `cp .env.example .env`
- The `prisma.config.ts` file loads environment variables from `.env`
- Verify DATABASE_URL is set correctly in `.env`

**Database connection errors:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Email not sending:**
- Verify email credentials in .env
- Check firewall/antivirus settings
- Try a different SMTP provider

**CORS errors:**
- Ensure backend is running on port 3000
- Ensure frontend is running on port 4200
- Check CORS configuration in backend/src/index.ts

## License

ISC
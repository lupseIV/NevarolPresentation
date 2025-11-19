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

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NevarolPresentation
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database and email credentials
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

# Optionally, use Prisma Studio to add sample data
npm run prisma:studio
```

### 3. Frontend Setup

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

Add products via the admin panel or Prisma Studio. Example product:

```json
{
  "name": "Sample Product",
  "description": "This is a sample product",
  "price": 29.99,
  "stock": 100,
  "imageUrl": "https://via.placeholder.com/300"
}
```

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
# Testing Guide

This guide provides instructions for testing the e-commerce application.

## Prerequisites

- Docker and Docker Compose installed
- Node.js v18+ installed
- All dependencies installed (see README.md)

## Quick Start Test

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Set Up Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 3. Start Backend Server

```bash
npm run dev
```

The backend should now be running on http://localhost:3000

### 4. Start Frontend (in a new terminal)

```bash
cd frontend
npm install
ng serve
```

The frontend should now be running on http://localhost:4200

## Manual Testing Steps

### Test User Registration and Login

1. Open http://localhost:4200 in your browser
2. Click "Register"
3. Fill in the registration form with:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123
4. Click "Register"
5. You should be redirected to the products page

### Test Product Browsing

1. You should see 12 sample products on the products page
2. Click on any product to view details
3. Verify product information is displayed correctly

### Test Shopping Cart

1. Click "Add to Cart" on a product
2. Click "Cart" in the navigation
3. Verify the product appears in the cart
4. Change the quantity
5. Verify the total updates correctly
6. Click "Remove" to test item removal
7. Add products again for checkout testing

### Test Checkout

1. With items in cart, click "Proceed to Checkout"
2. Click "Complete Order"
3. Verify order success message
4. Click "My Orders" to view order history
5. Verify the order appears in the list

### Test Admin Panel

1. Logout from the current user
2. Login with admin credentials:
   - Email: admin@example.com
   - Password: admin123
3. Click "Admin" in the navigation
4. Verify the dashboard shows statistics

#### Test User Management

1. In admin panel, click "Manage Users"
2. Verify all users are listed
3. Click "Edit" on a user
4. Modify user details
5. Click "Save"
6. Verify changes are saved

#### Test Product Management

1. Click "Manage Products"
2. Click "Add New Product"
3. Fill in product details:
   - Name: Test Product
   - Description: Test Description
   - Price: 99.99
   - Stock: 10
   - Image URL: https://via.placeholder.com/300
4. Click "Add"
5. Verify product appears in list
6. Click "Edit" on a product
7. Modify details and save
8. Click "Delete" on the test product

#### Test Order Management

1. Click "Manage Orders"
2. Verify all orders are listed
3. Click "View Details" on an order
4. Verify order details including customer info and items
5. Change the order status
6. Verify status is updated

## API Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "api123",
    "firstName": "API",
    "lastName": "User"
  }' \
  -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' \
  -c cookies.txt
```

### Get Products

```bash
curl http://localhost:3000/api/products
```

### Add to Cart

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Get Cart

```bash
curl http://localhost:3000/api/cart -b cookies.txt
```

### Checkout

```bash
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Get Orders

```bash
curl http://localhost:3000/api/orders -b cookies.txt
```

### Admin: Get All Users (requires admin login)

```bash
curl http://localhost:3000/api/admin/users -b cookies.txt
```

### Admin: Get Statistics

```bash
curl http://localhost:3000/api/admin/stats -b cookies.txt
```

## Expected Results

### Successful Test Criteria

- ✅ Users can register and login
- ✅ Products are displayed in a grid
- ✅ Products can be added to cart
- ✅ Cart displays correct items and totals
- ✅ Orders can be placed successfully
- ✅ Order history is accessible
- ✅ Admin can view dashboard with statistics
- ✅ Admin can manage users (view, edit, delete)
- ✅ Admin can manage products (create, edit, delete)
- ✅ Admin can manage orders (view, update status)
- ✅ Email notifications are sent (check console if email not configured)
- ✅ Session persists across page refreshes
- ✅ Navigation works correctly
- ✅ All forms validate input

## Troubleshooting

### Database Connection Issues

If you see database errors:
```bash
# Restart the database
docker-compose down
docker-compose up -d

# Wait a few seconds, then retry migrations
cd backend
npm run prisma:migrate
npm run seed
```

### Port Already in Use

If port 3000 or 4200 is already in use:
```bash
# For backend, edit backend/.env and change PORT=3000 to another port
# For frontend, run: ng serve --port 4201
```

### Email Not Sending

Email notifications require valid SMTP credentials in `backend/.env`. If not configured, the order will still be created but email will fail silently (check server console for errors).

### Session Issues

If session doesn't persist:
- Clear browser cookies
- Restart the backend server
- Check that SESSION_SECRET is set in .env

## Clean Up

To stop and remove all containers:

```bash
docker-compose down -v
```

This will remove the database and all data. Run the setup again to start fresh.

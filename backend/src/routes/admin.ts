import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { requireAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// User management
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, isAdmin } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { firstName, lastName, email, isAdmin },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isAdmin: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Product management
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stock, imageUrl }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, price, stock, imageUrl }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Order management
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/orders/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true }
    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

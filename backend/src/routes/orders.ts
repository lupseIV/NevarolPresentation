import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { requireAuth } from '../middleware/auth';
import { sendOrderEmail } from '../utils/email';

const router = Router();

// Get user's orders
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.session.userId },
      include: {
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

// Get single order
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.session.userId
      },
      include: {
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

// Create order from cart
router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Get products
    const productIds = req.session.cart.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    // Calculate total and prepare order items
    let total = 0;
    const orderItemsData = req.session.cart.items.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      const itemTotal = product.price * cartItem.quantity;
      total += itemTotal;
      return {
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price
      };
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.session.userId!,
        total,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    // Update product stock
    for (const item of req.session.cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Send email
    try {
      await sendOrderEmail(order.user.email, order);
    } catch (emailError) {
      console.error('Failed to send order email:', emailError);
    }

    // Clear cart
    req.session.cart = { items: [] };

    res.json(order);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

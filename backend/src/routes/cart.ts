import { Router, Request, Response } from 'express';

const router = Router();

// Get cart
router.get('/', (req: Request, res: Response) => {
  const cart = req.session.cart || { items: [] };
  res.json(cart);
});

// Add to cart
router.post('/add', (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) {
    req.session.cart = { items: [] };
  }

  const existingItem = req.session.cart.items.find(
    item => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.items.push({ productId, quantity });
  }

  res.json(req.session.cart);
});

// Update cart item
router.put('/update', (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const item = req.session.cart.items.find(
    item => item.productId === productId
  );

  if (item) {
    if (quantity <= 0) {
      req.session.cart.items = req.session.cart.items.filter(
        item => item.productId !== productId
      );
    } else {
      item.quantity = quantity;
    }
  }

  res.json(req.session.cart);
});

// Remove from cart
router.delete('/remove/:productId', (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId);

  if (!req.session.cart) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  req.session.cart.items = req.session.cart.items.filter(
    item => item.productId !== productId
  );

  res.json(req.session.cart);
});

// Clear cart
router.delete('/clear', (req: Request, res: Response) => {
  req.session.cart = { items: [] };
  res.json({ message: 'Cart cleared' });
});

export default router;

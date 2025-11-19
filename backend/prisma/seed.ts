import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isAdmin: true
    }
  });
  console.log('Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      isAdmin: false
    }
  });
  console.log('Created regular user:', user.email);

  // Create sample products
  const products = [
    {
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stock: 15,
      imageUrl: 'https://via.placeholder.com/300/0066cc/ffffff?text=Laptop+Pro'
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 29.99,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/300/00cc66/ffffff?text=Wireless+Mouse'
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      price: 89.99,
      stock: 30,
      imageUrl: 'https://via.placeholder.com/300/cc0066/ffffff?text=Keyboard'
    },
    {
      name: 'USB-C Hub',
      description: 'Multi-port USB-C hub with HDMI and ethernet',
      price: 49.99,
      stock: 40,
      imageUrl: 'https://via.placeholder.com/300/6600cc/ffffff?text=USB-C+Hub'
    },
    {
      name: 'Webcam HD',
      description: '1080p HD webcam with built-in microphone',
      price: 79.99,
      stock: 25,
      imageUrl: 'https://via.placeholder.com/300/cc6600/ffffff?text=Webcam'
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 199.99,
      stock: 20,
      imageUrl: 'https://via.placeholder.com/300/00cccc/ffffff?text=Headphones'
    },
    {
      name: 'Monitor 27"',
      description: '4K UHD 27-inch monitor with HDR',
      price: 399.99,
      stock: 12,
      imageUrl: 'https://via.placeholder.com/300/cc00cc/ffffff?text=Monitor+27'
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 34.99,
      stock: 35,
      imageUrl: 'https://via.placeholder.com/300/cccc00/ffffff?text=Desk+Lamp'
    },
    {
      name: 'External SSD 1TB',
      description: 'Portable SSD with USB 3.2 Gen 2',
      price: 129.99,
      stock: 18,
      imageUrl: 'https://via.placeholder.com/300/0099cc/ffffff?text=SSD+1TB'
    },
    {
      name: 'Phone Stand',
      description: 'Adjustable aluminum phone stand',
      price: 19.99,
      stock: 60,
      imageUrl: 'https://via.placeholder.com/300/cc9900/ffffff?text=Phone+Stand'
    },
    {
      name: 'Wireless Charger',
      description: 'Fast wireless charging pad',
      price: 24.99,
      stock: 45,
      imageUrl: 'https://via.placeholder.com/300/9900cc/ffffff?text=Charger'
    },
    {
      name: 'Laptop Sleeve',
      description: 'Protective laptop sleeve for 15" laptops',
      price: 22.99,
      stock: 55,
      imageUrl: 'https://via.placeholder.com/300/cc0099/ffffff?text=Laptop+Sleeve'
    }
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { id: 0 }, // This will always fail the where, so it creates
      update: {},
      create: productData
    }).catch(() => 
      prisma.product.create({ data: productData })
    );
    console.log('Created product:', product.name);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOrderEmail = async (to: string, order: any) => {
  const orderItemsHtml = order.orderItems.map((item: any) => `
    <tr>
      <td>${item.product.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Order Confirmation - Order #${order.id}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order Details</h2>
      <p>Order ID: ${order.id}</p>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
      </table>
      <h3>Total: $${order.total.toFixed(2)}</h3>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

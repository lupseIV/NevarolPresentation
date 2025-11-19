import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../services/order';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html'
})
export class Checkout {
  processing = false;
  error = '';

  constructor(
    private orderService: Order,
    private cartService: Cart,
    private router: Router
  ) {}

  completeOrder() {
    this.processing = true;
    this.error = '';

    this.orderService.checkout().subscribe({
      next: (order) => {
        this.processing = false;
        alert('Order placed successfully! Check your email for confirmation.');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.processing = false;
        this.error = err.error?.error || 'Failed to place order';
      }
    });
  }
}

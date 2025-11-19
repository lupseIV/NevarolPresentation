import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart as CartService } from '../../services/cart';
import { Product, ProductModel } from '../../services/product';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private productService: Product
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.cart$.subscribe(cart => {
      if (cart.items.length === 0) {
        this.cartItems = [];
        this.total = 0;
        return;
      }

      const productRequests = cart.items.map(item =>
        this.productService.getById(item.productId)
      );

      forkJoin(productRequests).subscribe(products => {
        this.cartItems = cart.items.map((item, index) => ({
          ...item,
          product: products[index]
        }));
        this.calculateTotal();
      });
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateCart(productId, quantity).subscribe();
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe();
  }

  clearCart() {
    this.cartService.clearCart().subscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductModel } from '../../services/product';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html'
})
export class Products implements OnInit {
  products: ProductModel[] = [];
  message = '';

  constructor(
    private productService: Product,
    private cartService: Cart
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(products => {
      this.products = products;
    });
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe(() => {
      this.message = 'Added to cart!';
      setTimeout(() => this.message = '', 2000);
    });
  }
}

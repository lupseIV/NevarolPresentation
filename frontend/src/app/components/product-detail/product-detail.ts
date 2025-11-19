import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductModel } from '../../services/product';
import { Cart } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  product: ProductModel | null = null;
  quantity = 1;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: Product,
    private cartService: Cart
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(+id).subscribe(product => {
        this.product = product;
      });
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe(() => {
        this.message = 'Added to cart!';
        setTimeout(() => this.router.navigate(['/cart']), 1000);
      });
    }
  }
}

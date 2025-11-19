import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html'
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  editingProduct: any = null;
  addingProduct = false;
  newProduct = { name: '', description: '', price: 0, stock: 0, imageUrl: '' };

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.adminService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  editProduct(product: any) {
    this.editingProduct = { ...product };
    this.addingProduct = false;
  }

  saveProduct() {
    if (this.editingProduct) {
      this.adminService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe(() => {
        this.loadProducts();
        this.editingProduct = null;
      });
    }
  }

  addProduct() {
    this.adminService.createProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.addingProduct = false;
      this.newProduct = { name: '', description: '', price: 0, stock: 0, imageUrl: '' };
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
    this.addingProduct = false;
  }

  showAddForm() {
    this.addingProduct = true;
    this.editingProduct = null;
  }
}

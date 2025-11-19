import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html'
})
export class AdminOrders implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.adminService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
  }

  updateStatus(orderId: number, status: string) {
    this.adminService.updateOrder(orderId, { status }).subscribe(() => {
      this.loadOrders();
      if (this.selectedOrder && this.selectedOrder.id === orderId) {
        this.selectedOrder.status = status;
      }
    });
  }

  closeDetail() {
    this.selectedOrder = null;
  }
}

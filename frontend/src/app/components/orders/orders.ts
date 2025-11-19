import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderModel } from '../../services/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html'
})
export class Orders implements OnInit {
  orders: OrderModel[] = [];

  constructor(private orderService: Order) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
  }
}

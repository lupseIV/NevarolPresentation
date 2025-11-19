import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderModel {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  orderItems: any[];
}

@Injectable({
  providedIn: 'root',
})
export class Order {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(this.apiUrl, { withCredentials: true });
  }

  getOrder(id: number): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  checkout(): Observable<OrderModel> {
    return this.http.post<OrderModel>(`${this.apiUrl}/checkout`, {}, { withCredentials: true });
  }
}

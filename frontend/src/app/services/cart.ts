import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private apiUrl = 'http://localhost:3000/api/cart';
  private cartSubject = new BehaviorSubject<CartData>({ items: [] });
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart() {
    this.http.get<CartData>(this.apiUrl, { withCredentials: true })
      .subscribe(cart => this.cartSubject.next(cart));
  }

  addToCart(productId: number, quantity: number): Observable<CartData> {
    return this.http.post<CartData>(`${this.apiUrl}/add`, { productId, quantity }, { withCredentials: true })
      .pipe(tap(cart => this.cartSubject.next(cart)));
  }

  updateCart(productId: number, quantity: number): Observable<CartData> {
    return this.http.put<CartData>(`${this.apiUrl}/update`, { productId, quantity }, { withCredentials: true })
      .pipe(tap(cart => this.cartSubject.next(cart)));
  }

  removeFromCart(productId: number): Observable<CartData> {
    return this.http.delete<CartData>(`${this.apiUrl}/remove/${productId}`, { withCredentials: true })
      .pipe(tap(cart => this.cartSubject.next(cart)));
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, { withCredentials: true })
      .pipe(tap(() => this.cartSubject.next({ items: [] })));
  }

  get itemCount(): number {
    return this.cartSubject.value.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

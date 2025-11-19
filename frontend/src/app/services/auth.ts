import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth();
  }

  checkAuth() {
    this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.currentUserSubject.next(null)
      });
  }

  register(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }
}

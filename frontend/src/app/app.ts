import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';
import { Cart } from './services/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'E-Commerce App';

  constructor(
    public authService: Auth,
    public cartService: Cart
  ) {}

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login';
    });
  }
}

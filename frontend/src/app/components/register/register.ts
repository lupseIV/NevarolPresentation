import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  formData = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  error = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.authService.register(this.formData).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => this.error = err.error?.error || 'Registration failed'
    });
  }
}

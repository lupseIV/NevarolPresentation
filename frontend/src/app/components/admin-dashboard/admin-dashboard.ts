import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboard implements OnInit {
  stats: any = {};

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.adminService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../services/admin';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html'
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  editingUser: any = null;

  constructor(private adminService: Admin) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: any) {
    this.editingUser = { ...user };
  }

  saveUser() {
    if (this.editingUser) {
      this.adminService.updateUser(this.editingUser.id, this.editingUser).subscribe(() => {
        this.loadUsers();
        this.editingUser = null;
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  cancelEdit() {
    this.editingUser = null;
  }
}

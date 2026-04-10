import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {

    // 🔥 Replace this with API call later
    if (this.email === 'admin@test.com') {

      localStorage.setItem('token', '123');
      localStorage.setItem('role', 'Admin');

      this.router.navigate(['/dashboard']);

    } else if (this.email === 'mr@test.com') {

      localStorage.setItem('token', '123');
      localStorage.setItem('role', 'MR');

      this.router.navigate(['/visits']);

    } else {

      alert('Invalid credentials');

    }
  }
}

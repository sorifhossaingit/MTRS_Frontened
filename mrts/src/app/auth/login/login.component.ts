import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Lock } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  Eye = Eye;
  EyeOff = EyeOff;
  Lock = Lock

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  email = '';
  password = '';

  // API URL
  apiUrl = 'https://localhost:7078/api/Auth/login';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (token) {

      // Decode token
      const decodedToken: any = jwtDecode(token);

      // Get values
      const rid =
        decodedToken.rid ||
        decodedToken.Rid;

      localStorage.setItem('rid', rid);

      const isSuperAdmin =
        decodedToken.isSuperAdmin ||
        decodedToken.IsSuperAdmin;

      const aid = decodedToken.aid

      // Manual role mapping
      let role = '';


      if (isSuperAdmin === 'True') {

        role = 'Superadmin';


      } else {

        switch (rid) {

          case 'a5fabfee-5506-4e12-bfec-c898fc5af3ae':
            role = 'Admin';
            break;

          case 'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43':
            role = 'MR';
            break;

          case '258fc58f-f4e8-4d51-9a19-7bc88f6f3d40':
            role = 'Stockist';
            break;

          case '39e853c2-805c-49f8-8527-15b2a9ede106':
            role = 'Manager';
            break;

          default:
            role = '';
        }
      }

      // Store role again

      localStorage.setItem('aid', aid)

      // Navigate
      this.navigateByRole(role);
    }
  }

  login() {

    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post(this.apiUrl, payload)
      .subscribe({

        next: (res: any) => {

          if (res.success) {

            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'Welcome back!',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {

              // Store token
              localStorage.setItem('token', res.token);

              // Decode token
              const decodedToken: any = jwtDecode(res.token);

              const rid = decodedToken.rid || decodedToken.Rid;
              localStorage.setItem('rid', rid);

              const isSuperAdmin =
                decodedToken.isSuperAdmin ||
                decodedToken.IsSuperAdmin;

              localStorage.setItem('is', isSuperAdmin);

              const aid = decodedToken.aid;

              let role = '';

              if (isSuperAdmin === 'True') {
                role = 'Superadmin';
              } else {

                switch (rid.toLowerCase()) {

                  case 'a5fabfee-5506-4e12-bfec-c898fc5af3ae':
                    role = 'Admin';
                    break;

                  case 'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43':
                    role = 'MR';
                    break;

                  case '258fc58f-f4e8-4d51-9a19-7bc88f6f3d40':
                    role = 'Stockist';
                    break;

                  case '39e853c2-805c-49f8-8527-15b2a9ede106':
                    role = 'Manager';
                    break;
                }
              }

              localStorage.setItem('aid', aid);

              this.navigateByRole(role);
            });
          }
        },

        error: (err) => {

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password'
          });
        }
      });
  }

  // ==========================
  // ROLE BASED ROUTING
  // ==========================
  navigateByRole(role: string) {

    switch (role) {

      case 'Superadmin':
        this.router.navigate([
          '/super-admin-master/super-admin-dashboard'
        ]);
        break;

      case 'Admin':
        this.router.navigate([
          '/dashboard'
        ]);
        break;

      case 'MR':
        this.router.navigate([
          '/medical-representative-master/mr-attendance'
        ]);
        break;

      case 'Stockist':
        this.router.navigate([
          '/stockist-master/stockist-product-dashboard'
        ]);
        break;

      case 'Manager':
        this.router.navigate([
          '/visits/visit-master-dashboard'
        ]);
        break;

      default:
        this.router.navigate(['/login']);
    }
  }
}

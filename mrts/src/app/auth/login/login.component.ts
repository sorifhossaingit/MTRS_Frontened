import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Lock } from 'lucide-angular';

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

    const isSuperAdmin =
      decodedToken.isSuperAdmin ||
      decodedToken.IsSuperAdmin;

    const aid = decodedToken.aid

    // Manual role mapping
    let role = '';
    let roleid = ''

    if (isSuperAdmin === 'True') {

      role = 'Superadmin';
      roleid = '1';

    } else {

      switch (Number(rid)) {

        case 2:
          role = 'Admin';
          roleid = '2';
          break;

        case 3:
          role = 'MR';
          roleid = '3';
          break;

        case 4:
          role = 'Stockist';
          roleid = '4';
          break;

        case 5:
          role = 'Manager';
          roleid = '5';
          break;

        default:
          role = '';
      }
    }

    // Store role again
    localStorage.setItem('rid', roleid);
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

            // Store token
            localStorage.setItem('token', res.token);

            // Decode token
            const decodedToken: any = jwtDecode(res.token);

            console.log(decodedToken);

            // =========================
            // GET VALUES FROM TOKEN
            // =========================

            const rid =
              decodedToken.rid ||
              decodedToken.Rid;

            const isSuperAdmin =
              decodedToken.isSuperAdmin ||
              decodedToken.IsSuperAdmin;

            const aid = decodedToken.aid

            // =========================
            // MANUAL ROLE MAPPING
            // =========================

            let role = '';
            let roleid = '';

            if (isSuperAdmin === 'True') {

              role = 'Superadmin';
              roleid = '1';

            } else {

              switch (Number(rid)) {

                case 2:
                  role = 'Admin';
                  roleid = '2';
                  break;

                case 3:
                  role = 'MR';
                  roleid = '3';
                  break;

                case 4:
                  role = 'Stockist';
                  roleid = '4'
                  break;

                case 5:
                  role = 'Manager';
                  roleid = '5';
                  break;

                default:
                  role = '';
              }
            }

            // Store role manually
            localStorage.setItem('rid', roleid);
            localStorage.setItem('aid', aid);
            
            this.navigateByRole(role);
          }
        },

        error: (err) => {

          console.log(err);

          alert('Invalid email or password');
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

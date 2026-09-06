import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Lock } from 'lucide-angular';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

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
    // apiUrl = 'https://api.cliniva.in/api/Auth/login';
    
  userid = 0

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {

    const token = localStorage.getItem('token');

    if (token) {

      // Decode token
      const decodedToken: any = jwtDecode(token);

      this.userid = decodedToken.userId;
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

          case '11714ca6-4cdb-46c5-bb12-d582ef179bc2':
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

  async login() {

  try {

    const position = await this.getCurrentLocation();
    const ipAddress = await this.getIpAddress();
    const deviceId = this.getDeviceId();

    const payload = {
      email: this.email,
      password: this.password,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      deviceId: deviceId,
      ipAddress: ipAddress
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

              localStorage.setItem('token', res.token);

              const decodedToken: any = jwtDecode(res.token);

              const rid = decodedToken.rid || decodedToken.Rid;
              localStorage.setItem('rid', rid);

              const isSuperAdmin =
                decodedToken.isSuperAdmin ||
                decodedToken.IsSuperAdmin;

              localStorage.setItem('is', isSuperAdmin);

              const aid = decodedToken.aid;
              this.userid = decodedToken.userId;

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

                  case '11714ca6-4cdb-46c5-bb12-d582ef179bc2':
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
            text: err?.error?.message || 'Invalid email or password'
          });
        }
      });

  } catch (error) {

    console.error(error);

    Swal.fire({
      icon: 'error',
      title: 'Location Required',
      text: 'Please allow location access to login.'
    });
  }
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

      // Set logged-in Admin user ID
      localStorage.setItem(
        'mid',
        this.userid.toString()
      );

      this.router.navigate([
        '/dashboard'
      ]);

      break;

      case 'MR':

        this.authService
          .get_mr_id(this.userid)
          .subscribe({

            next: (res: any) => {

              localStorage.setItem(
                'mid',
                res.medicalRepresentativeId.toString()
              );

              this.router.navigate([
                '/medical-representative-master/medical-representative-master-dashboard'
              ]);

            },
            error: (err: any) => {
              console.error(err);
            }

          });

        break;

      case 'Stockist':

        this.authService
          .get_stockist_id(this.userid)
          .subscribe({

            next: (res: any) => {

              localStorage.setItem(
                'mid',
                res.stockistId.toString()
              );

              this.router.navigate([
                '/stockist-master/stockist-product-dashboard'
              ]);

            },
            error: (err: any) => {
              console.error(err);
            }

          });

        break;

      case 'Manager':

        this.authService
          .get_area_manager_id(this.userid)
          .subscribe({

            next: (res: any) => {

              localStorage.setItem(
                'mid',
                res.areaManagerId.toString()
              );

              this.router.navigate([
                '/visits/visit-master-dashboard'
              ]);

            },
            error: (err: any) => {
              console.error(err);
            }

          });

        break;

      default:

        this.router.navigate([
          '/login'
        ]);
    }
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  async getIpAddress(): Promise<string> {
    try {
      const response: any = await fetch(
        'https://api.ipify.org?format=json'
      );
      const data = await response.json();
      return data.ip;
    } catch {
      return '';
    }
  }

  getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }

    return deviceId;
  }

}

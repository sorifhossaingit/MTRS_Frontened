import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { LayoutService } from '../../services/layout.service';
import {
  Eye,
  EyeOff
} from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();

  Eye = Eye;
  EyeOff = EyeOff;


  showProfileMenu = false;

  // Profile Modal
  showProfileModal = false;
  userId = 0;
  userName = '';

  // Change Password Modal
  showChangePasswordModal = false;
  currentPassword = '';
  newPassword = '';

  latitude = 0;
  longitude = 0;

  showCurrentPassword = false;
  showNewPassword = false;

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private http: HttpClient
  ) {
    this.loadUserDetails();
    this.getLocation();
  }

  loadUserDetails() {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      this.userId =
        decoded.userId ||
        decoded.UserId ||
        decoded.id ||
        decoded.Id ||
        0;

      this.userName =
        decoded.name ||
        decoded.Name ||
        decoded.unique_name ||
        decoded.sub ||
        'User';
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        () => {
          this.latitude = 0;
          this.longitude = 0;
        }
      );
    }
  }

  handleToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // ==========================
  // PROFILE
  // ==========================

  openProfileModal() {
    this.showProfileModal = true;
    this.showProfileMenu = false;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  // ==========================
  // CHANGE PASSWORD
  // ==========================

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
    this.showProfileMenu = false;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
    this.currentPassword = '';
    this.newPassword = '';
  }

  changePassword() {

    if (!this.currentPassword.trim()) {
      Swal.fire(
        'Validation Error',
        'Current Password is required',
        'warning'
      );
      return;
    }

    if (!this.newPassword.trim()) {
      Swal.fire(
        'Validation Error',
        'New Password is required',
        'warning'
      );
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{6,}$/;

    if (!passwordRegex.test(this.newPassword)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Password',
        html: `
        <div style="text-align:left">
          Password must contain:
          <ul style="margin-top:10px">
            <li>Minimum 6 characters</li>
            <li>At least 1 letter</li>
            <li>At least 1 number</li>
            <li>At least 1 special character</li>
          </ul>
        </div>
      `
      });
      return;
    }

    const payload = {
      userId: this.userId,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.layoutService.change_password(payload).subscribe({
      next: async (res: any) => {

        await Swal.fire({
          icon: 'success',
          title: res?.message || 'Password Changed Successfully',
          text: 'Please login again with your new password.'
        });

        this.closeChangePasswordModal();

        await this.logout(true);
      },

      error: (err) => {
        Swal.fire(
          'Error',
          err?.error?.message || 'Failed to change password',
          'error'
        );
      }
    });
  }

  // ==========================
  // LOGOUT
  // ==========================

  async logout(skipConfirmation = false) {

    if (!skipConfirmation) {

      const result = await Swal.fire({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Logout'
      });

      if (!result.isConfirmed) return;
    }

    const deviceId = this.getDeviceId();

    let ipAddress = '';

    try {
      const response: any = await fetch(
        'https://api.ipify.org?format=json'
      );

      const data = await response.json();
      ipAddress = data.ip;
    } catch {
      ipAddress = '';
    }

    const payload = {
      userId: this.userId,
      latitude: this.latitude,
      longitude: this.longitude,
      deviceId: deviceId,
      ipAddress: ipAddress
    };

    this.layoutService.logged_out(payload).subscribe({
      next: (res: any) => {

        Swal.fire({
          icon: 'success',
          title: res?.message || 'Logged Out Successfully',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      },

      error: (err) => {
        Swal.fire(
          'Logout Failed',
          err?.error?.message || 'Unable to logout. Please try again.',
          'error'
        );
      }
    });
  }


  getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');

    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }

    return deviceId;
  }
}


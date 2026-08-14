import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import { LayoutService } from '../../services/layout.service';

import {
  Eye,
  EyeOff,
  Menu,
  Stethoscope,
  Search,
  Bell,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  X,
  Info
} from 'lucide-angular';

export interface ProfileDetails {
  userId: number;
  userUuid: string;
  name: string;
  email: string;
  mobile: string;
  roleName: string;
  agencyName: string;
  agencyEmail: string;
  agencyPhone: string;
  isActive: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter<void>();

  // Lucide Icons Exposed to Template
  Eye = Eye;
  EyeOff = EyeOff;
  Menu = Menu;
  Stethoscope = Stethoscope;
  Search = Search;
  Bell = Bell;
  User = User;
  KeyRound = KeyRound;
  LogOut = LogOut;
  ChevronDown = ChevronDown;
  X = X;
  Info = Info;

  private destroy$ = new Subject<void>();

  // Dropdown & Modal States
  showProfileMenu = false;
  showProfileModal = false;
  showChangePasswordModal = false;

  // Form & View Controls
  showCurrentPassword = false;
  showNewPassword = false;

  // Password Model
  currentPassword = '';
  newPassword = '';

  // User Identification
  userId = 0;
  userName = 'User';

  // Geolocation
  latitude = 0;
  longitude = 0;

  // Profile Details State
  profileDetails: ProfileDetails = {
    userId: 0,
    userUuid: '',
    name: '',
    email: '',
    mobile: '',
    roleName: '',
    agencyName: '',
    agencyEmail: '',
    agencyPhone: '',
    isActive: false
  };

  // Base SweetAlert Configuration to keep alerts ABOVE modal backdrops (z-index 10000+)
  private swalHighZ = Swal.mixin({
    customClass: {
      container: 'swal2-top-layer'
    }
  });

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.getLocation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper for password visibility toggles
  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  private loadUserDetails(): void {
    const token = localStorage.getItem('token');

    if (token) {
      try {
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
      } catch (e) {
        console.error('Failed to decode JWT token:', e);
      }
    }
  }

  private getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => {
          console.warn('Unable to get location coordinates:', error);
          this.latitude = 0;
          this.longitude = 0;
        }
      );
    }
  }

  handleToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  // ==========================
  // PROFILE MODAL
  // ==========================

  openProfileModal(): void {
    this.showProfileMenu = false;

    this.layoutService.get_profile_details(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.profileDetails = res.data;
            this.showProfileModal = true;
          }
        },
        error: (err) => {
          this.swalHighZ.fire(
            'Error',
            err?.error?.message || 'Failed to load profile details',
            'error'
          );
        }
      });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  // ==========================
  // CHANGE PASSWORD MODAL
  // ==========================

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.showProfileMenu = false;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
  }

  changePassword(): void {
    if (!this.currentPassword.trim()) {
      this.swalHighZ.fire('Validation Error', 'Current Password is required', 'warning');
      return;
    }

    if (!this.newPassword.trim()) {
      this.swalHighZ.fire('Validation Error', 'New Password is required', 'warning');
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{6,}$/;

    if (!passwordRegex.test(this.newPassword)) {
      this.swalHighZ.fire({
        icon: 'warning',
        title: 'Invalid Password',
        html: `
          <div style="text-align:left">
            Password must contain:
            <ul style="margin-top:10px; padding-left:20px;">
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

    this.layoutService.change_password(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res: any) => {
          await this.swalHighZ.fire({
            icon: 'success',
            title: res?.message || 'Password Changed Successfully',
            text: 'Please login again with your new password.'
          });

          this.closeChangePasswordModal();
          await this.logout(true);
        },
        error: (err) => {
          this.swalHighZ.fire(
            'Error',
            err?.error?.message || 'Failed to change password',
            'error'
          );
        }
      });
  }

  // ==========================
  // LOGOUT WORKFLOW
  // ==========================

  async logout(skipConfirmation = false): Promise<void> {
    if (!skipConfirmation) {
      const result = await this.swalHighZ.fire({
        title: 'Logout?',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;
    }

    const deviceId = this.getDeviceId();
    let ipAddress = '';

    try {
      const response: any = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip || '';
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

    this.layoutService.logged_out(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.swalHighZ.fire({
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
          this.swalHighZ.fire(
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
      localStorage.setItem('deviceId', deviceId);
    }

    return deviceId;
  }
}
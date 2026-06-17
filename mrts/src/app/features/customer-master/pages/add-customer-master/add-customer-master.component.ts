import { Component, OnInit } from '@angular/core';
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  Save
} from 'lucide-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../services/customer.service';
import { HttpClient } from '@angular/common/http';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-add-customer-master',
  templateUrl: './add-customer-master.component.html',
  styleUrl: './add-customer-master.component.css'
})
export class AddCustomerMasterComponent implements OnInit {

  // =========================================================
  // 🔷 ICONS
  // =========================================================

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  MapPin = MapPin;
  FileText = FileText;
  Users = Users;
  Save = Save;

  // =========================================================
  // 🔷 VARIABLES
  // =========================================================

  customerForm!: FormGroup;

  submitted = false;

  agencyId: any =
    localStorage.getItem('aid');

  createdBy: any;

  areaManagerList: any[] = [];

  map!: Map | null;
  vectorSource = new VectorSource();
  vectorLayer!: VectorLayer;
  showMapModal = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private http: HttpClient
  ) { }

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getAreaManagerList();

  }

  // =========================================================
  // 🔷 FORM
  // =========================================================

  initializeForm() {
    this.customerForm = this.fb.group({
      agencyId: [this.agencyId],

      name: ['', Validators.required],
      type: ['', Validators.required],
      registrationNo: ['', Validators.required],

      contactPerson: ['', Validators.required],

      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],

      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],

      gstNo: [''],
      drugLicenseNo: [''],
      panNo: [''],

      assignedAreaManager: [0],
      region: [''],
      landline: [''],

      // 🔥 NEW REQUIRED FIELDS
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],

      createdBy: [0]
    });
  }


  openMap() {
    this.showMapModal = true;
    setTimeout(() => {
      this.loadMap();
    }, 300);
  }

  loadMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (this.map) {
      this.map.setTarget(undefined);
      this.map = null;
    }

    const defaultLat = this.customerForm.get('latitude')?.value || 22.5726;
    const defaultLng = this.customerForm.get('longitude')?.value || 88.3639;

    this.vectorSource.clear();

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        scale: 1.0
      })
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: markerStyle
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([defaultLng, defaultLat]), 
        zoom: 13
      })
    });

    if (this.customerForm.get('latitude')?.value && this.customerForm.get('longitude')?.value) {
      const existingFeature = new Feature({
        geometry: new Point(fromLonLat([defaultLng, defaultLat]))
      });
      this.vectorSource.addFeature(existingFeature);
    }

    setTimeout(() => {
      if (this.map) this.map.updateSize();
    }, 100);

    this.map.on('singleclick', (event) => {
      this.updateMarkerAndForm(event.coordinate);
    });
  }

  // 🔷 NEW: CORE ADDRESS SEARCH METRIC
  searchAddress(query: string) {
    if (!query || !query.trim()) return;

    // Call free OpenStreetMap Geocoding API safely
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    this.http.get<any[]>(url).subscribe({
      next: (results: string | any[]) => {
        if (results && results.length > 0) {
          const location = results[0];
          const lat = parseFloat(location.lat);
          const lon = parseFloat(location.lon);
          const olCoordinates = fromLonLat([lon, lat]);

          // Drop marker pin & patch form data
          this.updateMarkerAndForm(olCoordinates);

          // Animate Map Pan directly over target view coordinates
          if (this.map) {
            this.map.getView().animate({
              center: olCoordinates,
              zoom: 15,
              duration: 800
            });
          }
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No Location Found',
            text: 'Could not find any results matching that address. Please try something more specific.',
            confirmButtonColor: '#3b82f6'
          });
        }
      },
      error: (err: any) => {
        console.error('Geocoding Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Search Failed',
          text: 'Something went wrong while looking up the address.',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }

  // Helper code to handle repetitive marker updating work cleanly
  private updateMarkerAndForm(coordinate: any) {
    const lonLat = toLonLat(coordinate);
    const lng = lonLat[0];
    const lat = lonLat[1];

    this.vectorSource.clear();
    const markerFeature = new Feature({
      geometry: new Point(coordinate)
    });
    this.vectorSource.addFeature(markerFeature);

    this.customerForm.patchValue({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    });
    this.customerForm.get('latitude')?.markAsTouched();
  }
  // =========================================================
  // 🔷 GET AREA MANAGER LIST
  // =========================================================

  getAreaManagerList() {

    this.customerService
      .getAreamanagerlist(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.areaManagerList = res.data || [];

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================

  getUserIdFromToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decodedToken: any =
        jwtDecode(token);

      this.createdBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 SAVE CUSTOMER
  // =========================================================

  saveCustomer() {

    this.submitted = true;

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });

      return;

    }

    const formValue =
      this.customerForm.value;

    const payload = {
      agencyId: this.agencyId,
      name: formValue.name,
      type: formValue.type,
      registrationNo: formValue.registrationNo,

      contactPerson: formValue.contactPerson,
      mobile: formValue.mobile,
      email: formValue.email,

      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      pincode: formValue.pincode,

      gstNo: formValue.gstNo,
      drugLicenseNo: formValue.drugLicenseNo,
      panNo: formValue.panNo,

      assignedAreaManager: Number(formValue.assignedAreaManager),
      region: formValue.region,
      landline: formValue.landline,

      // 🔥 NEW
      latitude: formValue.latitude,
      longitude: formValue.longitude,
      isActive:true,
      createdBy: this.createdBy
    };

    this.customerService
      .addcustomer(payload)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Customer Added Successfully',
            confirmButtonColor: '#16a34a'
          }).then(() => {

            this.router.navigate([
              '/customer-master/customer-master-dashboard'
            ]);

          });

        },

        error: (err: any) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err?.error?.message ||
              'Something went wrong',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

  // =========================================================
  // 🔷 FORM CONTROLS
  // =========================================================

  get f() {

    return this.customerForm.controls;

  }

}

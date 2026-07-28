import { Component, OnInit } from '@angular/core';
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  Save,
  Plus
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

Plus = Plus;

showCustomerTypeModal = false;

newCustomerType = '';



  customerTypeList: any[] = [];

  customerForm!: FormGroup;

  submitted = false;


routeList: any[] = [];

showRouteModal = false;

newRouteName = '';

newRouteDescription = '';


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

    this.getCustomerTypeList();

    this.getRouteList();

  }

  // =========================================================
  // 🔷 FORM
  // =========================================================

  initializeForm() {
    this.customerForm = this.fb.group({
      agencyId: [this.agencyId],

      name: ['', Validators.required],
      type: [null, Validators.required],
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
      routeId: [null, Validators.required],
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

  if (!navigator.geolocation) {

    Swal.fire(
      'Error',
      'Geolocation is not supported by your browser.',
      'error'
    );

    setTimeout(() => this.loadMap(), 300);

    return;
  }

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      this.customerForm.patchValue({
        latitude,
        longitude
      });

      setTimeout(() => {
        this.loadMap();
      }, 300);

    },

    (error) => {

      Swal.fire(
        'Location Error',
        'Unable to get your current location.',
        'error'
      );

      setTimeout(() => {
        this.loadMap();
      }, 300);

    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

  );

}

loadMap() {

  if (this.map) {
    this.map.setTarget(undefined);
    this.map = null;
  }

  const lat = this.customerForm.get('latitude')?.value || 22.5726;
  const lng = this.customerForm.get('longitude')?.value || 88.3639;

  this.vectorSource.clear();

  this.vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        scale: 1
      })
    })
  });

  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      this.vectorLayer
    ],
    view: new View({
      center: fromLonLat([lng, lat]),
      zoom: 16
    })
  });

  const coordinate = fromLonLat([lng, lat]);

  this.updateMarkerAndForm(coordinate);

  this.map.on('singleclick', (event) => {
    this.updateMarkerAndForm(event.coordinate);
  });

  setTimeout(() => {
    this.map?.updateSize();
  }, 100);

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

    // const payload = {
    //   agencyId: this.agencyId,
    //   name: formValue.name,
    //   type: formValue.type,
    //   registrationNo: formValue.registrationNo,

    //   contactPerson: formValue.contactPerson,
    //   mobile: formValue.mobile,
    //   email: formValue.email,

    //   address: formValue.address,
    //   city: formValue.city,
    //   state: formValue.state,
    //   pincode: formValue.pincode,

    //   gstNo: formValue.gstNo,
    //   drugLicenseNo: formValue.drugLicenseNo,
    //   panNo: formValue.panNo,

    //   assignedAreaManager: Number(formValue.assignedAreaManager),
    //   region: formValue.region,
    //   landline: formValue.landline,

    //   // 🔥 NEW
    //   latitude: formValue.latitude,
    //   longitude: formValue.longitude,
    //   isActive:true,
    //   routeId: Number(formValue.routeId),
    //   createdBy: this.createdBy
    // };

const payload = {
  agencyId: Number(this.agencyId),
  name: formValue.name,
  type: Number(formValue.type),
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
  isActive: true,
  assignedAreaManager: Number(formValue.assignedAreaManager),
  createdBy: Number(this.createdBy),
  region: formValue.region,
  landline: formValue.landline,
  latitude: Number(formValue.latitude),
  longitude: Number(formValue.longitude),
  routeId: Number(formValue.routeId)
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

  submitLocation() {

  if (
    !this.customerForm.get('latitude')?.value ||
    !this.customerForm.get('longitude')?.value
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Select Location',
      text: 'Please select a location on the map first.'
    });
    return;
  }

  this.showMapModal = false;

  Swal.fire({
    icon: 'success',
    title: 'Location Selected',
    text: 'Location has been saved successfully.',
    timer: 1500,
    showConfirmButton: false
  });

}
getCustomerTypeList() {

  this.http.get<any[]>(
    'https://localhost:7078/api/v1/admin/customer/get-customertype'
  ).subscribe({

    next: (res) => {

      this.customerTypeList = res;

    },

    error: (err) => {

      console.log(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to load customer types.'
      });

    }

  });

}

openCustomerTypeModal(){

  this.showCustomerTypeModal=true;

}

addCustomerType(){

  if(!this.newCustomerType.trim()){

    Swal.fire(
      'Validation',
      'Enter Customer Type',
      'warning'
    );

    return;
  }

  const payload={

    customerType:this.newCustomerType,

    createdby:this.createdBy

  };

  this.http.post(
    'https://localhost:7078/api/v1/admin/customer/create-customertype',
    payload
  ).subscribe({

    next:()=>{

      Swal.fire(
        'Success',
        'Customer Type Added',
        'success'
      );

      this.newCustomerType='';

      this.getCustomerTypeList();

    },

    error:(err)=>{

      console.log(err);

      Swal.fire(
        'Error',
        'Unable to add customer type',
        'error'
      );

    }

  });

}

deleteCustomerType(id:number){

  Swal.fire({

    title:'Delete Customer Type?',

    icon:'warning',

    showCancelButton:true,

    confirmButtonText:'Delete'

  }).then(result=>{

    if(result.isConfirmed){

      this.http.delete(
        `https://localhost:7078/api/v1/admin/customer/delete-customertype/${id}`
      ).subscribe({

        next:()=>{

          Swal.fire(
            'Deleted',
            'Customer Type Deleted',
            'success'
          );

          this.getCustomerTypeList();

        },

        error:(err)=>{

          console.log(err);

          Swal.fire(
            'Error',
            'Unable to delete customer type',
            'error'
          );

        }

      });

    }

  });

}

getRouteList() {

  this.http.get<any[]>(
    'https://localhost:7078/api/v1/admin/customer/get-route'
  ).subscribe({

    next: (res) => {

      this.routeList = res;

    },

    error: (err) => {

      console.log(err);

    }

  });

}

openRouteModal() {

  this.showRouteModal = true;

}
addRoute() {

  if (!this.newRouteName.trim()) {

    Swal.fire(
      'Validation',
      'Route Name is required.',
      'warning'
    );

    return;

  }

  const payload = {

    createdby: this.createdBy,

    routeName: this.newRouteName,

    description: this.newRouteDescription

  };

  this.http.post(
    'https://localhost:7078/api/v1/admin/customer/create-route',
    payload
  ).subscribe({

    next: () => {

      Swal.fire(
        'Success',
        'Route Added Successfully',
        'success'
      );

      this.newRouteName = '';

      this.newRouteDescription = '';

      this.getRouteList();

    },

    error: (err) => {

      console.log(err);

      Swal.fire(
        'Error',
        'Unable to add route.',
        'error'
      );

    }

  });

}
deleteRoute(id: number) {

  Swal.fire({

    title: 'Delete Route?',

    icon: 'warning',

    showCancelButton: true,

    confirmButtonText: 'Delete'

  }).then(result => {

    if (result.isConfirmed) {

      this.http.delete(
        `https://localhost:7078/api/v1/admin/customer/delete-route/${id}`
      ).subscribe({

        next: () => {

          Swal.fire(
            'Deleted',
            'Route Deleted Successfully',
            'success'
          );

          this.getRouteList();

        },

        error: (err) => {

          console.log(err);

          Swal.fire(
            'Error',
            'Unable to delete route.',
            'error'
          );

        }

      });

    }

  });

}
}

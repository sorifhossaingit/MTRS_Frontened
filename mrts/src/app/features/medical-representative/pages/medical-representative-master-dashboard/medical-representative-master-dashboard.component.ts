import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  UserCheck,
  Plus,
  ClipboardList,
  CheckCircle,
  MapPin,
  Route,
  Package,
  ShoppingCart,
  MapPinned,
  Calendar
} from 'lucide-angular';

import { MrService } from '../../services/mr.service';

import Swal from 'sweetalert2';

// =====================================================
// OpenLayers Imports
// =====================================================

import Map from 'ol/Map';
import View from 'ol/View';

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import {
  fromLonLat,
  toLonLat
} from 'ol/proj';

import {
  Style,
  Icon
} from 'ol/style';


// =====================================================
// Interfaces
// =====================================================

interface TodayVisit {
  visitPlanId: number;
  visitDate: string;
  routeName: string | null;
  customerName: string | null;
  address: string | null;
  mobile: string | null;
  visitStatus: string | null;
  plannedTime: string | null;
  sequenceNo: number | null;
  completedAt: string | null;
}

interface RouteItem {
  location: string;
  time: string;
}

interface SampleItem {
  product: string;
  qty: number;
}


// =====================================================
// Component
// =====================================================

@Component({
  selector:
    'app-medical-representative-master-dashboard',

  templateUrl:
    './medical-representative-master-dashboard.component.html',

  styleUrl:
    './medical-representative-master-dashboard.component.css'
})
export class MedicalRepresentativeMasterDashboardComponent
  implements OnInit, OnDestroy {


  // ===================================================
  // ICONS
  // ===================================================

  UserCheck = UserCheck;
  Plus = Plus;
  ClipboardList = ClipboardList;
  CheckCircle = CheckCircle;
  MapPin = MapPin;
  Route = Route;
  Package = Package;
  ShoppingCart = ShoppingCart;
  MapPinned = MapPinned;
  Calendar = Calendar;


  // ===================================================
  // MR ID
  // ===================================================

  mrmainidId: number | null = null;


  // ===================================================
  // LOADING
  // ===================================================

  isLoading = false;

  todayVisits: TodayVisit[] = [];
  // ===================================================
  // AUTO REFRESH
  // ===================================================

  private refreshIntervalId:
    ReturnType<typeof setInterval> | null = null;


  // ===================================================
  // DATE INFORMATION
  // ===================================================

  currentMonthName =
    new Date().toLocaleString(
      'default',
      {
        month: 'long',
        year: 'numeric'
      }
    );


  // ===================================================
  // OPENLAYERS MAP
  // ===================================================

  map: Map | null = null;

  vectorSource =
    new VectorSource();

  vectorLayer!:
    VectorLayer<VectorSource>;


  // ===================================================
  // CURRENT LOCATION
  // ===================================================

  currentLatitude: number =
    22.5726;

  currentLongitude: number =
    88.3639;

  lastLocationTime =
    'N/A';


  // ===================================================
  // PRIMARY METRICS
  // ===================================================

  attendanceStatus =
    'Present';

  visitsDone = 0;

  routeCount = 0;

  samplesGiven = 0;

  totalOrders = 0;


  // ===================================================
  // MONTHLY METRICS
  // ===================================================

  monthlyVisitsDone = 0;

  monthlyOrders = 0;

  monthlyTargetPercentage = 0;


  // ===================================================
  // VISIT BREAKDOWN
  // ===================================================

  completedVisits = 0;

  inProgressVisits = 0;

  rejectedVisits = 0;


  // ===================================================
  // ROUTE BREAKDOWN
  // ===================================================

  plannedRouteVisits = 0;

  withoutRouteVisits = 0;


  // ===================================================
  // PRODUCT / ORDER BREAKDOWN
  // ===================================================

  totalShownProducts = 0;

  pendingOrders = 0;

  deliveredOrders = 0;

  rejectedOrders = 0;


  // ===================================================
  // LIST DATA
  // ===================================================


  routePlan: RouteItem[] = [];

  samples: SampleItem[] = [];


  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(
    private mrService: MrService
  ) { }


  // ===================================================
  // ON INIT
  // ===================================================

  ngOnInit(): void {

    this.mrmainidId =
      Number(localStorage.getItem('mid')) || null;

    if (this.mrmainidId) {

      this.getMrDashboard();

      this.getTodayVisits();

    }

    this.openMap();

    this.startAutoRefresh();
  }


  // ===================================================
  // ON DESTROY
  // ===================================================

  ngOnDestroy(): void {

    // -----------------------------------------------
    // Stop auto refresh
    // -----------------------------------------------

    this.stopAutoRefresh();


    // -----------------------------------------------
    // Destroy OpenLayers map
    // -----------------------------------------------

    if (this.map) {

      this.map.setTarget(
        undefined
      );

      this.map = null;
    }
  }


  // ===================================================
  // START AUTO REFRESH
  // ===================================================

  private startAutoRefresh(): void {

    // Prevent duplicate intervals
    this.stopAutoRefresh();


    this.refreshIntervalId =
      setInterval(() => {

        console.log(
          'Refreshing MR dashboard...'
        );


        // -------------------------------------------
        // Refresh dashboard
        // -------------------------------------------

        if (this.mrmainidId) {

          this.getMrDashboard();

        }


        // -------------------------------------------
        // Refresh GPS / Map
        // -------------------------------------------

        this.refreshMapLocation();


      }, 60 * 1000);
  }


  // ===================================================
  // STOP AUTO REFRESH
  // ===================================================

  private stopAutoRefresh(): void {

    if (
      this.refreshIntervalId !== null
    ) {

      clearInterval(
        this.refreshIntervalId
      );

      this.refreshIntervalId = null;
    }
  }


  // ===================================================
  // OPEN MAP
  // ===================================================

  openMap(): void {

    // -----------------------------------------------
    // Check browser geolocation support
    // -----------------------------------------------

    if (!navigator.geolocation) {

      Swal.fire(
        'Error',
        'Geolocation is not supported by your browser.',
        'error'
      );


      setTimeout(() => {

        this.loadMap();

      }, 300);

      return;
    }


    // -----------------------------------------------
    // Get current location
    // -----------------------------------------------

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.currentLatitude =
          position.coords.latitude;

        this.currentLongitude =
          position.coords.longitude;


        this.lastLocationTime =
          new Date().toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit'
            }
          );


        console.log(
          'Initial Location:',
          this.currentLatitude,
          this.currentLongitude
        );


        setTimeout(() => {

          this.loadMap();

        }, 300);
      },


      (error) => {

        console.warn(
          'Initial location error:',
          error
        );


        Swal.fire(
          'Location Error',
          'Unable to get your current location. Showing default location.',
          'warning'
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


  // ===================================================
  // REFRESH MAP LOCATION
  // ===================================================

  refreshMapLocation(): void {

    if (!navigator.geolocation) {

      console.warn(
        'Geolocation is not supported.'
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        // -------------------------------------------
        // Update GPS coordinates
        // -------------------------------------------

        this.currentLatitude =
          position.coords.latitude;

        this.currentLongitude =
          position.coords.longitude;


        // -------------------------------------------
        // Update location time
        // -------------------------------------------

        this.lastLocationTime =
          new Date().toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit'
            }
          );


        console.log(
          'Updated Location:',
          this.currentLatitude,
          this.currentLongitude
        );


        // -------------------------------------------
        // Convert GPS to OpenLayers coordinate
        // -------------------------------------------

        const coordinate =
          fromLonLat([
            this.currentLongitude,
            this.currentLatitude
          ]);


        // -------------------------------------------
        // Update existing map
        // -------------------------------------------

        if (this.map) {

          // Update marker
          this.updateMarkerAndForm(
            coordinate
          );


          // Move map to latest location
          this.map
            .getView()
            .animate({

              center: coordinate,

              duration: 500

            });

        }
        else {

          // Map does not exist
          // Create it

          this.loadMap();

        }
      },


      (error) => {

        console.warn(
          'Unable to refresh current location:',
          error
        );

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  // ===================================================
  // LOAD MAP
  // ===================================================

  loadMap(): void {

    // -----------------------------------------------
    // Destroy previous map if exists
    // -----------------------------------------------

    if (this.map) {

      this.map.setTarget(
        undefined
      );

      this.map = null;
    }


    // -----------------------------------------------
    // Fallback coordinates
    // -----------------------------------------------

    const lat =
      this.currentLatitude ||
      22.5726;

    const lng =
      this.currentLongitude ||
      88.3639;


    // -----------------------------------------------
    // Clear markers
    // -----------------------------------------------

    this.vectorSource.clear();


    // -----------------------------------------------
    // Vector Layer
    // -----------------------------------------------

    this.vectorLayer =
      new VectorLayer({

        source:
          this.vectorSource,

        style:
          new Style({

            image:
              new Icon({

                anchor:
                  [0.5, 1],

                src:
                  'https://openlayers.org/en/latest/examples/data/icon.png',

                scale:
                  1

              })

          })

      });


    // -----------------------------------------------
    // Create Map
    // -----------------------------------------------

    this.map =
      new Map({

        target:
          'map',

        layers: [

          // Base Map
          new TileLayer({

            source:
              new OSM()

          }),

          // Marker Layer
          this.vectorLayer

        ],


        view:
          new View({

            center:
              fromLonLat([
                lng,
                lat
              ]),

            zoom:
              16

          })

      });


    // -----------------------------------------------
    // Add initial marker
    // -----------------------------------------------

    const coordinate =
      fromLonLat([
        lng,
        lat
      ]);


    this.updateMarkerAndForm(
      coordinate
    );


    // -----------------------------------------------
    // Map Click
    // -----------------------------------------------

    this.map.on(
      'singleclick',
      (event) => {

        this.updateMarkerAndForm(
          event.coordinate
        );

      }
    );


    // -----------------------------------------------
    // Update map size
    // -----------------------------------------------

    setTimeout(() => {

      this.map?.updateSize();

    }, 100);
  }


  // ===================================================
  // UPDATE MARKER
  // ===================================================

  updateMarkerAndForm(
    coordinate: number[]
  ): void {

    // -----------------------------------------------
    // Remove old marker
    // -----------------------------------------------

    this.vectorSource.clear();


    // -----------------------------------------------
    // Create new marker
    // -----------------------------------------------

    const feature =
      new Feature({

        geometry:
          new Point(
            coordinate
          )

      });


    // -----------------------------------------------
    // Add marker
    // -----------------------------------------------

    this.vectorSource.addFeature(
      feature
    );


    // -----------------------------------------------
    // Convert coordinate to GPS
    // -----------------------------------------------

    const lonLat =
      toLonLat(
        coordinate
      );


    this.currentLongitude =
      lonLat[0];

    this.currentLatitude =
      lonLat[1];


    // -----------------------------------------------
    // Update time
    // -----------------------------------------------

    this.lastLocationTime =
      new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );
  }


  // ===================================================
  // GET MR DASHBOARD
  // ===================================================

  getMrDashboard(): void {

    if (!this.mrmainidId) {

      return;
    }


    this.isLoading = true;


    this.mrService
      .getMrDashboard(
        this.mrmainidId
      )
      .subscribe({

        // ===========================================
        // SUCCESS
        // ===========================================

        next: (response: any) => {

          console.log(
            'MR Dashboard Response:',
            response
          );


          if (
            response?.success &&
            response?.data
          ) {

            const data =
              response.data;


            // =======================================
            // VISITS
            // =======================================

            this.visitsDone =
              data.completedVisits ?? 0;


            this.completedVisits =
              data.completedVisits ?? 0;


            this.inProgressVisits =
              data.inProgressVisits ?? 0;


            this.rejectedVisits =
              data.rejectedVisits ?? 0;


            // =======================================
            // ROUTES
            // =======================================

            this.routeCount =
              data.plannedRouteVisits ?? 0;


            this.plannedRouteVisits =
              data.plannedRouteVisits ?? 0;


            this.withoutRouteVisits =
              data.withoutRouteVisits ?? 0;


            // =======================================
            // PRODUCTS / SAMPLES
            // =======================================

            this.samplesGiven =
              data.totalShownProducts ?? 0;


            this.totalShownProducts =
              data.totalShownProducts ?? 0;


            // =======================================
            // MONTHLY DATA
            // =======================================

            this.monthlyVisitsDone =
              data.monthlyVisitsDone ??
              data.completedVisits ??
              0;


            this.monthlyOrders =
              data.monthlyOrders ??
              data.totalOrders ??
              0;


            this.monthlyTargetPercentage =
              data.monthlyTargetPercentage ??
              0;


            // =======================================
            // ORDERS
            // =======================================

            this.totalOrders =
              data.totalOrders ?? 0;


            this.pendingOrders =
              data.pendingOrders ?? 0;


            this.deliveredOrders =
              data.deliveredOrders ?? 0;


            this.rejectedOrders =
              data.rejectedOrders ?? 0;


            // =======================================
            // LIST DATA
            // ========


            this.routePlan =
              data.routePlan ?? [];


            this.samples =
              data.samples ?? [];


            // =======================================
            // LAST LOCATION
            // =======================================

            if (
              data.lastLocationTime
            ) {

              this.lastLocationTime =
                data.lastLocationTime;
            }
          }


          this.isLoading = false;
        },


        // ===========================================
        // ERROR
        // ===========================================

        error: (error) => {

          console.error(
            'MR Dashboard API Error:',
            error
          );


          this.isLoading = false;
        }

      });
  }



  getTodayVisits(): void {

    if (!this.mrmainidId) {
      return;
    }

    this.mrService
      .getTodayVisitsDashboard(this.mrmainidId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Today Visits Response:',
            response
          );

          if (
            response?.success &&
            response?.data
          ) {

            this.todayVisits =
              response.data ?? [];

          } else {

            this.todayVisits = [];

          }

        },

        error: (error) => {

          console.error(
            'Today Visits API Error:',
            error
          );

          this.todayVisits = [];

        }

      });
  }
}
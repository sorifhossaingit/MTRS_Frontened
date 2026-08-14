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

// OpenLayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';


// =====================================================
// INTERFACES
// =====================================================

interface DcrItem {
  doctor: string;
  time: string;
  status: string;
}

interface RouteItem {
  location: string;
  time: string;
}

interface SampleItem {
  product: string;
  qty: number;
}


// Today's Visit

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


// Today's Visit Product

interface TodayVisitProduct {
  customerName: string | null;
  customerMobile: string | null;
  name: string | null;
  brandName: string | null;
  genericName: string | null;
}


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


  // =====================================================
  // ICONS
  // =====================================================

  UserCheck = UserCheck;
  Plus = Plus;
  ClipboardList = ClipboardList;
  CheckCircle = CheckCircle;
  MapPin = MapPin;
  Route = Route;
  Package = Package;
  MapPinned = MapPinned;
  ShoppingCart = ShoppingCart;
  Calendar = Calendar;


  // =====================================================
  // MR ID
  // =====================================================

  mrmainidId: number | null = null;


  // =====================================================
  // LOADING
  // =====================================================

  isLoading = false;


  // =====================================================
  // DATE
  // =====================================================

  currentMonthName =
    new Date().toLocaleString(
      'default',
      {
        month: 'long',
        year: 'numeric'
      }
    );


  // =====================================================
  // MAP
  // =====================================================

  map: Map | null = null;

  vectorSource =
    new VectorSource();

  vectorLayer!:
    VectorLayer<VectorSource>;

  currentLatitude = 22.5726;

  currentLongitude = 88.3639;

  lastLocationTime = 'N/A';


  // =====================================================
  // DASHBOARD METRICS
  // =====================================================

  attendanceStatus = 'Present';

  visitsDone = 0;

  routeCount = 0;

  samplesGiven = 0;

  totalOrders = 0;


  // =====================================================
  // MONTHLY
  // =====================================================

  monthlyVisitsDone = 0;

  monthlyOrders = 0;

  monthlyTargetPercentage = 0;


  // =====================================================
  // VISIT BREAKDOWN
  // =====================================================

  completedVisits = 0;

  inProgressVisits = 0;

  rejectedVisits = 0;


  // =====================================================
  // ROUTE BREAKDOWN
  // =====================================================

  plannedRouteVisits = 0;

  withoutRouteVisits = 0;


  // =====================================================
  // PRODUCT / ORDER
  // =====================================================

  totalShownProducts = 0;

  pendingOrders = 0;

  deliveredOrders = 0;

  rejectedOrders = 0;


  // =====================================================
  // LIST DATA
  // =====================================================

  dcrList: DcrItem[] = [];

  routePlan: RouteItem[] = [];

  samples: SampleItem[] = [];


  // =====================================================
  // TODAY VISITS
  // =====================================================

  todayVisits: TodayVisit[] = [];


  // =====================================================
  // TODAY VISIT PRODUCTS
  // =====================================================

  todayVisitProducts:
    TodayVisitProduct[] = [];


  // =====================================================
  // REFRESH TIMER
  // =====================================================

  private refreshInterval: any;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private mrService: MrService
  ) {}


  // =====================================================
  // ON INIT
  // =====================================================

  ngOnInit(): void {

    this.mrmainidId =
      Number(
        localStorage.getItem('mid')
      ) || null;


    if (this.mrmainidId) {

      // Dashboard
      this.getMrDashboard();

      // Today's Visits
      this.getTodayVisits();

      // Today's Visit Products
      this.getTodayVisitProducts();

    }


    // Open Map
    this.openMap();


    // =================================================
    // REFRESH EVERY 1 MINUTE
    // =================================================

    this.refreshInterval =
      setInterval(() => {

        if (this.mrmainidId) {

          this.getMrDashboard();

          this.getTodayVisits();

          this.getTodayVisitProducts();

        }

      }, 300000);

  }


  // =====================================================
  // ON DESTROY
  // =====================================================

  ngOnDestroy(): void {

    if (this.refreshInterval) {

      clearInterval(
        this.refreshInterval
      );

    }


    if (this.map) {

      this.map.setTarget(
        undefined
      );

      this.map = null;

    }

  }


  // =====================================================
  // MAP
  // =====================================================

  openMap(): void {

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


        setTimeout(() => {

          this.loadMap();

        }, 300);

      },


      (error) => {

        console.error(
          'Location Error:',
          error
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


  // =====================================================
  // LOAD MAP
  // =====================================================

  loadMap(): void {

    if (this.map) {

      this.map.setTarget(
        undefined
      );

      this.map = null;

    }


    const lat =
      this.currentLatitude ||
      22.5726;

    const lng =
      this.currentLongitude ||
      88.3639;


    this.vectorSource.clear();


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

                scale: 1

              })

          })

      });


    this.map =
      new Map({

        target: 'map',

        layers: [

          new TileLayer({

            source:
              new OSM()

          }),

          this.vectorLayer

        ],

        view:
          new View({

            center:
              fromLonLat([
                lng,
                lat
              ]),

            zoom: 16

          })

      });


    const coordinate =
      fromLonLat([
        lng,
        lat
      ]);


    this.updateMarkerAndForm(
      coordinate
    );


    this.map.on(
      'singleclick',
      (event) => {

        this.updateMarkerAndForm(
          event.coordinate
        );

      }
    );


    setTimeout(() => {

      this.map?.updateSize();

    }, 100);

  }


  // =====================================================
  // UPDATE MAP MARKER
  // =====================================================

  updateMarkerAndForm(
    coordinate: number[]
  ): void {

    this.vectorSource.clear();


    const feature =
      new Feature({

        geometry:
          new Point(
            coordinate
          )

      });


    this.vectorSource.addFeature(
      feature
    );


    const lonLat =
      toLonLat(
        coordinate
      );


    this.currentLongitude =
      lonLat[0];

    this.currentLatitude =
      lonLat[1];


    this.lastLocationTime =
      new Date().toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }


  // =====================================================
  // MR MONTHLY DASHBOARD
  // =====================================================

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

        next: (response: any) => {

          console.log(
            'MR Dashboard:',
            response
          );


          if (
            response?.success &&
            response?.data
          ) {

            const data =
              response.data;


            // Visits

            this.visitsDone =
              data.completedVisits ?? 0;

            this.completedVisits =
              data.completedVisits ?? 0;

            this.inProgressVisits =
              data.inProgressVisits ?? 0;

            this.rejectedVisits =
              data.rejectedVisits ?? 0;


            // Routes

            this.routeCount =
              data.plannedRouteVisits ?? 0;

            this.plannedRouteVisits =
              data.plannedRouteVisits ?? 0;

            this.withoutRouteVisits =
              data.withoutRouteVisits ?? 0;


            // Products

            this.samplesGiven =
              data.totalShownProducts ?? 0;

            this.totalShownProducts =
              data.totalShownProducts ?? 0;


            // Orders

            this.totalOrders =
              data.totalOrders ?? 0;

            this.pendingOrders =
              data.pendingOrders ?? 0;

            this.deliveredOrders =
              data.deliveredOrders ?? 0;

            this.rejectedOrders =
              data.rejectedOrders ?? 0;


            // Monthly

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

          }


          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'MR Dashboard API Error:',
            error
          );

          this.isLoading = false;

        }

      });

  }


  // =====================================================
  // TODAY VISITS
  // =====================================================

  getTodayVisits(): void {

    if (!this.mrmainidId) {
      return;
    }


    this.mrService
      .getTodayVisitsDashboard(
        this.mrmainidId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Today Visits:',
            response
          );


          if (
            response?.success &&
            response?.data
          ) {

            this.todayVisits =
              response.data ?? [];

          }
          else {

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


  // =====================================================
  // TODAY VISIT PRODUCTS
  // =====================================================

  getTodayVisitProducts(): void {

    if (!this.mrmainidId) {
      return;
    }


    this.mrService
      .getTodayVisitProductsDashboard(
        this.mrmainidId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Today Visit Products:',
            response
          );


          if (
            response?.success &&
            response?.data
          ) {

            this.todayVisitProducts =
              response.data ?? [];

          }
          else {

            this.todayVisitProducts =
              [];

          }

        },


        error: (error) => {

          console.error(
            'Today Visit Products API Error:',
            error
          );

          this.todayVisitProducts = [];

        }

      });

  }

}
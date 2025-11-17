import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-driver-tracking',
  templateUrl: './driver-tracking.page.html',
  styleUrls: ['./driver-tracking.page.scss'],
})
export class DriverTrackingPage implements OnInit, OnDestroy {
  bookingId: string = '';
  map!: google.maps.Map;
  driverMarker!: google.maps.Marker;
  locationSubscription?: Subscription;
  lastUpdated: string = '';
  isLoading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.initializeMap();
      this.startLocationTracking(this.bookingId);
    });
  }

  ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  async initializeMap() {
    try {
      // Default center (Johannesburg)
      const defaultCenter = { lat: -26.2041, lng: 28.0473 };
      
      const mapOptions = {
        center: defaultCenter,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(
        document.getElementById('trackingMap') as HTMLElement,
        mapOptions
      );

       // Initialize driver marker with red car icon
       this.driverMarker = new google.maps.Marker({
         position: defaultCenter,
         map: this.map,
         title: 'Driver Location',
         icon: {
           url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#DC2626">
               <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-1.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
               <circle cx="6.5" cy="14.5" r="1" fill="#FFFFFF"/>
               <circle cx="17.5" cy="14.5" r="1" fill="#FFFFFF"/>
             </svg>
           `),
           scaledSize: new google.maps.Size(40, 40),
           anchor: new google.maps.Point(20, 20)
         }
       });

      this.isLoading = false;
    } catch (error) {
      console.error('Error initializing map:', error);
      this.error = 'Failed to initialize map';
      this.isLoading = false;
    }
  }

  startLocationTracking(bookingId: string) {
    // Update location every 5 seconds
    this.locationSubscription = interval(5000)
      .pipe(
        switchMap(() => this.navigationService.getDriverLocation(bookingId)) // TODO: Use actual driver ID
      )
      .subscribe(
        (location) => {
          this.updateDriverLocation(location);
          this.lastUpdated = new Date().toLocaleTimeString();
          this.error = '';
        },
        (error) => {
          console.error('Error getting driver location:', error);
          this.error = 'Failed to get driver location';
        }
      );

    // Get initial location immediately
    this.navigationService.getDriverLocation(bookingId).subscribe(
      (location) => {
        this.updateDriverLocation(location);
        this.lastUpdated = new Date().toLocaleTimeString();
      },
      (error) => {
        console.error('Error getting initial driver location:', error);
        this.error = 'Failed to get driver location';
      }
    );
  }

  updateDriverLocation(location: any) {
    if (location && location.latitude && location.longitude) {
      const newPosition = {
        lat: location.latitude,
        lng: location.longitude
      };

      // Update marker position
      this.driverMarker.setPosition(newPosition);
      
      // Center map on new position
      this.map.setCenter(newPosition);
      
      console.log('Driver location updated:', newPosition);
    }
  }

  refreshLocation() {
    this.isLoading = true;
    this.navigationService.getDriverLocation('driver123').subscribe(
      (location) => {
        this.updateDriverLocation(location);
        this.lastUpdated = new Date().toLocaleTimeString();
        this.isLoading = false;
        this.error = '';
      },
      (error) => {
        console.error('Error refreshing driver location:', error);
        this.error = 'Failed to refresh driver location';
        this.isLoading = false;
      }
    );
  }
}

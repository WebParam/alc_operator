import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderOptions,
} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NavigationService } from 'src/app/services/navigation.service';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-driver-navigator',
  templateUrl: './driver-navigator.page.html',
  styleUrls: ['./driver-navigator.page.scss'],
})
export class DriverNavigatorPage implements OnInit, OnDestroy {
  @ViewChild('map') mapRef: ElementRef | undefined;
  address = '';
  map!: google.maps.Map;
  navText = 'Start';
  driverMarker: Marker = { coordinate: { lat: 0, lng: 0 } };
  driverMarkerId: string | undefined;
  driverMarkerOnMap: boolean = false;
  bounds = new google.maps.LatLngBounds();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  driverPosition: google.maps.LatLng | undefined;
  customerPosition: google.maps.LatLng | undefined;
  markers: google.maps.Marker[] = [];
  estimatedTime = '';
  booking:any;
  arrivalTimeCalculated = false;
  currentLeg: any;
  private watchPositionId: string = '';
  private locationUpdateInterval: any;
  driverId: string =""; // Temporary - should be retrieved from user service
  private lastApiCallTime: number = 0;
  private readonly API_CALL_THROTTLE_MS = 20000; // 20 seconds throttle
  constructor(
    private nativeGeocoder: NativeGeocoder,
    private navigationService: NavigationService,
    private router: Router,
    private bookingService: BookingService
  ) { }
  ionViewDidEnter(): void {
    // this.createMap();
    console.log(this.bookingService.currentLeg);
    this.currentLeg = this.bookingService.currentLeg;
    this.driverId = this.currentLeg.bookingNumber;
  }

  ngOnInit() { 


    // Expose test method globally for debugging
    // (window as any).driverNavTest = () => this.testDriverLocationTracking();
  }

  ngOnDestroy(): void {
    // Clean up location tracking when component is destroyed
    this.stopLocationTracking();
  }

  // Ionic lifecycle: called when leaving the view (but component may stay alive)
  async ionViewWillLeave(): Promise<void> {
    // Ensure tracking stops when user navigates away from this page
    await this.stopLocationTracking();
    // Reset UI state
    this.navText = 'Start';
  }

  // Also catch didLeave to be extra safe
  async ionViewDidLeave(): Promise<void> {
    await this.stopLocationTracking();
  }

  // async createMap() {
  //   const coordinates = await Geolocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //   });
  //   const currentPosition = {
  //     lat: coordinates.coords.latitude,
  //     lng: coordinates.coords.longitude,
  //   };
  //   // this.map = await GoogleMap.create({
  //   //   id: 'my-map',
  //   //   element: this.mapRef?.nativeElement,
  //   //   apiKey: environment.mapsKey,
  //   //   config: {
  //   //     center: currentPosition,
  //   //     zoom: 14,
  //   //   },
  //   // });

  //   // this.map.enableClustering(2);

  //   let mapProp = {
  //     center: new google.maps.LatLng(
  //       coordinates.coords.latitude,
  //       coordinates.coords.longitude
  //     ),
  //     zoom: 12,
  //   };

  //   this.map = new google.maps.Map(
  //     document.getElementById('googleMap') as any,
  //     mapProp
  //   );
  //   this.setDriversPosition(currentPosition);

  //   this.navigationService
  //     .getCustomerPosition(this.currentLeg.bookingNumber)
  //     .subscribe((position: any) => {
  //       this.setCustomerPosition(position);
  //       if (!this.address) {
  //         let options: NativeGeocoderOptions = {
  //           useLocale: true,
  //           maxResults: 5,
  //         };
  //         this.nativeGeocoder
  //           .reverseGeocode(position?.lat, position?.lng, options)
  //           .then((result: /*NativeGeocoderResult[]*/ any[]) => {
  //             console.log(JSON.stringify(result[0]));
  //             this.address = result[0]?.addressLines[0];
  //           })
  //           .catch((error: any) => console.log(error));
  //       }
  //     });

  //   this.directionsRenderer.setMap(this.map);
  // }
  // async setDriversPosition(coords: LatLng) {
  //   if (coords) {
  //     let marker!: google.maps.Marker;
  //     console.log('coords', coords);
  //     console.log('marker', marker);
  //     if (this.markers.length <= 1) {
  //       marker = new google.maps.Marker({
  //         position: coords,
  //         map: this.map,
  //         title: 'Driver',
  //       });
  //       this.markers.push(marker);
  //       this.markers[0].setMap(this.map);
  //     } else {
  //       this.markers[0].setPosition(coords);
  //     }
  //     this.driverPosition = new google.maps.LatLng(coords.lat, coords.lng);
  //     this.bounds.extend(coords);
  //     this.map.fitBounds(this.bounds);
  //     // this.calcRoute();
  //   }
  // }

  // async setCustomerPosition(coords: LatLng) {
  //   if (coords) {
  //     if (!this.markers[1]) {
  //       const marker = new google.maps.Marker({
  //         position: coords,
  //         map: this.map,
  //         title: 'You',
  //       });
  //       this.markers.push(marker);
  //       this.markers[0].setMap(this.map);
  //       this.bounds.extend(coords);
  //       this.customerPosition = new google.maps.LatLng(coords.lat, coords.lng);
  //     } else {
  //       this.markers[1].setPosition(coords);
  //     }
  //     this.bounds.extend(coords);
  //     this.map.fitBounds(this.bounds);
  //     this.calcRoute();
  //   }
  // }

  // calcRoute() {
  //   if (!this.customerPosition || !this.driverPosition) {
  //     return;
  //   }
  //   let request = {
  //     origin: this.driverPosition,
  //     destination: this.customerPosition,
  //     travelMode: google.maps.TravelMode['DRIVING'],
  //   };
  //   const _this = this;
  //   this.directionsService.route(
  //     request,
  //     function (response: any, status: string) {
  //       if (status == 'OK') {
  //         _this.directionsRenderer.setDirections(response);
  //         if (!_this.arrivalTimeCalculated) {
  //           let now = new Date().getTime();
  //           response.routes[0].legs.forEach((leg: any) => {
  //             now += leg.duration.value * 1000;
  //           });
  //           _this.estimatedTime = new Date(now).toISOString();
  //           console.log('time', _this.estimatedTime);
  //           _this.arrivalTimeCalculated = true;
  //         }
  //       }
  //     }
  //   );
  // }

  endTrip() {
    this.bookingService
      .endDelivery(this.currentLeg.bookingNumber, this.currentLeg.stageNumber, this.currentLeg.mvaNumber)
      .subscribe((result) => {
        console.log(result);
        this.router.navigateByUrl('/at-delivery-location');
      });
  }

  async startTrip(): Promise<void> {
    if (this.navText == 'Start') {
      this.navText = 'End';
      
      // Start continuous location tracking
      await this.startLocationTracking();
      
      // Begin delivery process
      this.bookingService
        .beginDelivery(
          this.currentLeg.bookingNumber,
          this.currentLeg.stageNumber
        )
        .subscribe((result:any) => {
          this.booking = result;
          const book = this.bookingService.currentLeg;
          
          const destGPS = result.getBookingResult.legs.leg[0].destinationAddress.coordinate;
          const collGPS = result.getBookingResult.legs.leg[0].collectionAddress.coordinate;

          // Try to build a human-readable destination address to show in Waze
          const destAddrObj = result.getBookingResult.legs.leg[0].destinationAddress || {};
          const addressText =
            destAddrObj.formattedAddress ||
            (Array.isArray(destAddrObj.addressLines) ? destAddrObj.addressLines.join(', ') : undefined) ||
            destAddrObj.address ||
            destAddrObj.street ||
            destAddrObj.suburb ||
            destAddrObj.city ||
            `${destGPS.latitude},${destGPS.longitude}`;
debugger;
          const encodedAddress = encodeURIComponent(addressText);
          // Include the address in the 'q' parameter so Waze will display it when opening
          const url = `https://waze.com/ul?ll=${destGPS.latitude},${destGPS.longitude}&q=${encodedAddress}&navigate=yes`;
          window.open(url);
        });
      } else {
        // Stop location tracking
        await this.stopLocationTracking();
        this.navText = 'Start';
      }
  }

  /**
   * Start continuous location tracking for the driver
   */
  private async startLocationTracking(): Promise<void> {
    try {
    
      // Reset throttle timer to allow immediate first call
      this.lastApiCallTime = 0;
      
      // Get initial position
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      
    
      // Track initial location via API (will always call since throttle is reset)
      this.updateDriverLocation(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      );
      
        // Start watcher for position changes
        this.watchPositionId = (await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            maximumAge: 5000, // Cache position results for 5 seconds (GPS can update frequently)
            timeout: 10000, // Timeout after 10 seconds
          },
        (position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            this.updateDriverLocation(latitude, longitude);
          }
        }
      )).toString();
      
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  /**
   * Stop location tracking and cleanup resources
   */
  private async stopLocationTracking(): Promise<void> {
    try {
      if (this.watchPositionId) {
        await Geolocation.clearWatch({
          id: this.watchPositionId,
        });
        this.watchPositionId = '';
      }
      
      if (this.locationUpdateInterval) {
        clearInterval(this.locationUpdateInterval);
        this.locationUpdateInterval = null;
      }
      
      console.log('Stopped location tracking for driver:', this.driverId);
    } catch (error) {
      console.error('Failed to stop location tracking:', error);
    }
  }

  /**
   * Update driver location via the booking service API with throttling
   */
  private updateDriverLocation(latitude: number, longitude: number): void {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCallTime;
    
    // Only call API if enough time has passed (20 seconds throttle)
    if (timeSinceLastCall >= this.API_CALL_THROTTLE_MS) {
      console.log('📍 Calling API - throttle cleared:', {
        timeSinceLastCall: Math.round(timeSinceLastCall / 1000) + 's',
        throttle: this.API_CALL_THROTTLE_MS / 1000 + 's',
        coordinates: [latitude, longitude]
      });
      
      this.lastApiCallTime = now;
      
      this.bookingService.trackDriverLocation(
        this.driverId,
        latitude,
        longitude,
        this.currentLeg?.bookingNumber || '',
        this.currentLeg?.stageNumber?.toString() || ''
      ).subscribe(
        (response: any) => {
          console.log('✅ API call successful:', {
            timestamp: new Date().toISOString(),
            success: response.success
          });
        },
        (error) => {
          console.error('❌ API call failed:', error);
        }
      );
    } else {
      const remainingTime = Math.ceil((this.API_CALL_THROTTLE_MS - timeSinceLastCall) / 1000);
      console.log(`⏱️ Throttled - next API call in ${remainingTime}s`);
    }
  }


  openTrackingPage() {
    const trackingUrl = `https://alcmicrosite.avis.co.za/assets/track?trackid=${this.currentLeg.bookingNumber}`;
    const fullUrl = `${trackingUrl}`;
    window.open(fullUrl, '_blank');
  }
}

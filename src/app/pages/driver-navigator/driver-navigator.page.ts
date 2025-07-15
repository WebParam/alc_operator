import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class DriverNavigatorPage implements OnInit {
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
  constructor(
    private nativeGeocoder: NativeGeocoder,
    private navigationService: NavigationService,
    private router: Router,
    private bookingService: BookingService
  ) { }
  ionViewDidEnter(): void {
    this.createMap();
    console.log(this.bookingService.currentLeg);
    this.currentLeg = this.bookingService.currentLeg;
  }

  ngOnInit() { }

  async createMap() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    const currentPosition = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };
    // this.map = await GoogleMap.create({
    //   id: 'my-map',
    //   element: this.mapRef?.nativeElement,
    //   apiKey: environment.mapsKey,
    //   config: {
    //     center: currentPosition,
    //     zoom: 14,
    //   },
    // });

    // this.map.enableClustering(2);

    let mapProp = {
      center: new google.maps.LatLng(
        coordinates.coords.latitude,
        coordinates.coords.longitude
      ),
      zoom: 12,
    };

    this.map = new google.maps.Map(
      document.getElementById('googleMap') as any,
      mapProp
    );
    this.setDriversPosition(currentPosition);

    this.navigationService
      .getCustomerPosition(this.currentLeg.bookingNumber)
      .subscribe((position: any) => {
        this.setCustomerPosition(position);
        if (!this.address) {
          let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5,
          };
          this.nativeGeocoder
            .reverseGeocode(position?.lat, position?.lng, options)
            .then((result: /*NativeGeocoderResult[]*/ any[]) => {
              console.log(JSON.stringify(result[0]));
              this.address = result[0]?.addressLines[0];
            })
            .catch((error: any) => console.log(error));
        }
      });

    this.directionsRenderer.setMap(this.map);
  }
  async setDriversPosition(coords: LatLng) {
    if (coords) {
      let marker!: google.maps.Marker;
      console.log('coords', coords);
      console.log('marker', marker);
      if (this.markers.length <= 1) {
        marker = new google.maps.Marker({
          position: coords,
          map: this.map,
          title: 'Driver',
        });
        this.markers.push(marker);
        this.markers[0].setMap(this.map);
      } else {
        this.markers[0].setPosition(coords);
      }
      this.driverPosition = new google.maps.LatLng(coords.lat, coords.lng);
      this.bounds.extend(coords);
      this.map.fitBounds(this.bounds);
      // this.calcRoute();
    }
  }

  async setCustomerPosition(coords: LatLng) {
    if (coords) {
      if (!this.markers[1]) {
        const marker = new google.maps.Marker({
          position: coords,
          map: this.map,
          title: 'You',
        });
        this.markers.push(marker);
        this.markers[0].setMap(this.map);
        this.bounds.extend(coords);
        this.customerPosition = new google.maps.LatLng(coords.lat, coords.lng);
      } else {
        this.markers[1].setPosition(coords);
      }
      this.bounds.extend(coords);
      this.map.fitBounds(this.bounds);
      this.calcRoute();
    }
  }

  calcRoute() {
    if (!this.customerPosition || !this.driverPosition) {
      return;
    }
    let request = {
      origin: this.driverPosition,
      destination: this.customerPosition,
      travelMode: google.maps.TravelMode['DRIVING'],
    };
    const _this = this;
    this.directionsService.route(
      request,
      function (response: any, status: string) {
        if (status == 'OK') {
          _this.directionsRenderer.setDirections(response);
          if (!_this.arrivalTimeCalculated) {
            let now = new Date().getTime();
            response.routes[0].legs.forEach((leg: any) => {
              now += leg.duration.value * 1000;
            });
            _this.estimatedTime = new Date(now).toISOString();
            console.log('time', _this.estimatedTime);
            _this.arrivalTimeCalculated = true;
          }
        }
      }
    );
  }

  endTrip() {
    this.bookingService
      .endDelivery(this.currentLeg.bookingNumber, this.currentLeg.stageNumber)
      .subscribe((result) => {
        console.log(result);
        this.router.navigateByUrl('/at-delivery-location');
      });
  }

  async startTrip(): Promise<void> {
    // TODO: Confirm that position watching stops after end navigation

    let watchId = '';
    if (this.navText == 'Start') {
      this.navText = 'End';
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

          const url = `https://www.google.com/maps/dir/?api=1&destination=${destGPS.latitude},${destGPS.longitude}&travelmode=driving&dir_action=navigate`;
          window.open(url);
        });

      watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 10000,
        },
        (postion) => {
          if (postion) {
            const { latitude, longitude } = postion.coords;
            this.navigationService.setDriversPosition(
              latitude,
              longitude,
              this.currentLeg.bookingNumber
            );
            this.setDriversPosition({ lat: latitude, lng: longitude });
          }
        }
      );

  
    } else {
      await Geolocation.clearWatch({
        id: watchId,
      });
      this.navText = 'Start';
    }
  }
}

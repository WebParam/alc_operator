import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { RangeValue } from '@ionic/core';
import { RangeCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { IVehicle, setSelectedVehicle } from 'src/app/store/bookings.actions';

@Component({
  selector: 'app-available-vehicles',
  templateUrl: './available-vehicles.page.html',
  styleUrls: ['./available-vehicles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AvailableVehiclesPage implements OnInit {
  seats: RangeValue | undefined;
  doors: number | undefined;
  availableVehicles: any;
  booking: any;

  constructor(
    private store: Store,
    private router: Router,
    private alertController: AlertController
  ) {
      this.store
      .select((store: any) => store.bookings.vehicles)
      .subscribe((vehicles) => {
        console.log("vehicles", vehicles)
        this.availableVehicles = vehicles;
     
      });

  }

  getBooking() {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
        let booking = res.selectedBooking;
        const dropOffDate = new Date(booking.dropOffDate);
        const pickUpDate = new Date(booking.pickUpDate);
        let days =
          (dropOffDate.getTime() - pickUpDate.getTime()) /
          (1000 * 60 * 60 * 24);

   
      });
  }

  async ngOnInit() {
    console.log('No. of vehicles' + this.availableVehicles);
    if (this.availableVehicles == null) {
      const alert = await this.alertController.create({
        header: 'ERROR',
        subHeader: '',
        message: 'No vehicle(s) available for the selected dates/location',
        cssClass: 'otp-alert',
        buttons: [
          {
            text: 'Back',
            cssClass: 'primary-btn',
            handler: () => {
              this.router.navigate(['vehicle-finder']);
            },
          },
        ],
      });
      await alert.present();
    }
  }

  onSeatsChange(ev: Event) {
    this.seats = (ev as RangeCustomEvent).detail.value;
  }

  async applyFilter() {
    
    this.availableVehicles = structuredClone(this.availableVehicles);
    if (this.doors) {
      this.availableVehicles?.forEach((av: any) => {
        av.vehicles = av.vehicles.filter(
          (v: any) => v.doors == this.doors?.toString()
        );
      });
    }
  }
  viewVehicle(vehicle: IVehicle) {
    console.log("view", vehicle)
    const payload = {
      vehicle:vehicle
    };
    this.store.dispatch(setSelectedVehicle({ vehicle: vehicle }));
    
    console.log("vehicle",vehicle)
    this.router.navigate(['vehicle-details']);
  }
}

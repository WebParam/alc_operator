import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';
import { AddressAutocompleteComponent } from 'src/app/shared/address-autocomplete/address-autocomplete.component';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { setVehicles } from 'src/app/store/bookings.actions';
@Component({
  selector: 'app-vehicle-finder',
  templateUrl: './vehicle-finder.page.html',
  styleUrls: ['./vehicle-finder.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressAutocompleteComponent,
    // BottomMenuPage,
  ],
  providers: [DatePipe],
})
export class VehicleFinderPage implements OnInit, OnDestroy {
  isAirportPickUp = false;
  isAirportDropOff = false;
  pickUpAirports: any[] = [];
  dropOffAirports: any[] = [];
  vehicleFinderForm: FormGroup;
  highlightedDates: any[] = [];
  pickUpDate!: Date;
  dropOffDate!: Date;
  now: string | null;
  minDate: string | null;
  maxDate: string | null;
  booking!: any;
  leg:any;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router,
    private toastController: ToastController,
    private store: Store,
    private datePipe: DatePipe
  ) {
    this.getAirports();
    const now = new Date();
    this.now = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.minDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.maxDate = this.datePipe.transform(
      now.setDate(now.getDate() + 30),
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.vehicleFinderForm = this.fb.group({
      pickUp: ['', [Validators.required]],
      dropOff: ['', [Validators.required]],
      pickUpAirport: ['', [Validators.required]],
      dropOffAirport: ['', [Validators.required]],
      pickupflightno: [''],
      dropoffflightno: [''],
    });
    const sub = this.store
      .select((store: any) => store.bookings.inProgressBooking)
      .subscribe((res) => {
        console.log("RES", res)
        this.booking = res;
        const stateBooking = res as any;
        if (this.booking) {
          if (this.booking.pickUp) {
            this.vehicleFinderForm.controls['pickUp'].setValue(
              this.booking.pickUp
            );
          }
          if (this.booking.dropOff) {
            this.vehicleFinderForm.controls['dropOff'].setValue(
              this.booking.dropOff
            );
          }
          if (this.booking.pickUpDate) {
            const monentPickUp = moment(this.booking.pickUpDate).toISOString();
            this.pickUpDate = this.booking.pickUpDate;
            this.dateSelected({
              detail: {
                value: monentPickUp,
              },
            });
          }
          if (this.booking.dropOffDate) {
             const monentDropOff = moment(this.booking.dropOffDate).toISOString();
             console.log("CURR",monentDropOff)
            this.dropOffDate = this.booking.dropOffDate;
            this.dateSelected({
              detail: {
                value: monentDropOff,
              },
            });
          }
    
          if (this.booking.pickupflightno) {
          
            this.vehicleFinderForm.controls['pickupflightno'].setValue(
              this.booking.pickupflightno
            );
          }
          if (this.booking.dropoffflightno) {
            this.vehicleFinderForm.controls['dropoffflightno'].setValue(
              this.booking.dropoffflightno
            );
          }
          this.isAirportPickUp = this.booking.isAirportPickUp ?? false;
          this.isAirportDropOff = this.booking.isAirportDropOff ?? false;
          if (this.isAirportPickUp) {
            this.vehicleFinderForm.controls['pickUpAirport'].setValue(
              this.booking.pickUpAirport
            );
          }
          if (this.isAirportDropOff) {
            this.vehicleFinderForm.controls['dropOffAirport'].setValue(
              this.booking.dropOffAirport
            );
          }
        }
      });
    
      this.store
      .select((store: any) => store.bookings.inProgressLeg)
      .subscribe((leg) => {
        console.log("leginit", leg)
        this.leg = leg;
     
      });
    this.subscriptions?.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
  getAirports() {
    this.bookingService
      .getAvailableAirports()
      .subscribe(
        (airports) => (this.pickUpAirports = this.dropOffAirports = airports)
      );
  }
  ngOnInit() {}

  dateSelected(date: any) {

    if (this.highlightedDates.length >= 2) {
      this.highlightedDates = [];
    }
    console.log(date);
    if (this.highlightedDates.length === 0) {
      this.pickUpDate = new Date(date.detail.value);
      this.highlightedDates.push({
        date: date.detail.value,
        textColor: '#ffffff',
        backgroundColor: '#000000',
      });
    } else {
      this.dropOffDate = new Date(date.detail.value);
      this.highlightedDates.push({
        date: date.detail.value,
        textColor: '#ffffff',
        backgroundColor: '#000000',
      });
      let tmpDate = this.pickUpDate;
      const startDate = this.highlightedDates[0];
      const endDate = this.highlightedDates[1];
      this.highlightedDates = [];
      this.highlightedDates.push(startDate);
      while (this.pickUpDate < this.dropOffDate) {
        tmpDate.setDate(tmpDate.getDate() + 1);
        this.highlightedDates.push({
          date: this.datePipe.transform(tmpDate, 'yyyy-MM-dd'),
          textColor: '#ffffff',
          backgroundColor: '#e1ded9',
        });
      }
      this.pickUpDate = new Date(startDate.date);
      this.dropOffDate = new Date(endDate.date);
    }
  }
  doSearch() {
   
    let payload = {
      collectionAddress: {
        Coordinate: {
          latitude: -26.13616,
          longitude: 28.24155,
        },
        locationType: this.isAirportPickUp ? 'AIRPORT' : 'ADDRESS',
        name: this.isAirportDropOff
          ? this.vehicleFinderForm.value.pickUpAirport
          : this.vehicleFinderForm.value.pickUp,
        suburb: this.isAirportDropOff
          ? this.vehicleFinderForm.value.pickUpAirport
          : this.vehicleFinderForm.value.pickUp,
        town: this.isAirportDropOff
          ? this.vehicleFinderForm.value.pickUpAirport
          : this.vehicleFinderForm.value.pickUp,
      },
      collectionDateTime: this.pickUpDate,
      destinationAddress: {
       
        Coordinate: {
          latitude: -26.13616,
          longitude: 28.24155,
        },
        locationType: this.isAirportDropOff ? 'AIRPORT' : 'ADDRESS',
        name: this.isAirportDropOff
          ? this.vehicleFinderForm.value.dropOffAirport
          : this.vehicleFinderForm.value.dropOff,
        suburb: this.isAirportDropOff
          ? this.vehicleFinderForm.value.dropOffAirport
          : this.vehicleFinderForm.value.dropOff,
        town: this.isAirportDropOff
          ? this.vehicleFinderForm.value.dropOffAirport
          : this.vehicleFinderForm.value.dropOff,
      },
      destinationDateTime: this.dropOffDate,
      pax: 20,
      rateIdentifier: 'NONE',
      rateNumber: '',
    } as any;

    console.log("test", payload)


  this.bookingService.getVehicleRates(payload).subscribe((res)=>{

    
    // this.store.dispatch(setVehicles({ vehicles: res }));
   
    console.log("leg", this.leg)
    console.log("res", res)
 

    // const type = this.leg.bookingType.id==3?0 : this.leg.bookingType == 2?0: 0 ;
    const anyRes = res as any;
    const availableVehicles = anyRes.availableVehicles[0].vehicles;
    console.log("vehicles", availableVehicles);
    this.store.dispatch(setVehicles({ vehicles: availableVehicles }));
    console.log("nev");
    this.router.navigate(["available-vehicles"]);
  });

    // const booking = {
    //   ...this.booking,
    //   ...this.vehicleFinderForm.value,
    //   dropOffDate: this.dropOffDate,
    //   pickUpDate: this.pickUpDate,
    //   ...payload,
    //   isAirportDropOff: this.isAirportDropOff,
    //   isAirportPickUp: this.isAirportPickUp,
    // };
    // this.store.dispatch(addBooking({ booking }));

  }
  enablePickUpAirport(event: any) {
    this.isAirportPickUp = event.detail.checked;
  }
  enableDropOffAirport(event: any) {
    this.isAirportDropOff = event.detail.checked;
  }

  setDropOff(event: any) {
    //   this.vehicleFinderForm.controls['dropOff'].setValue(
    //     event.formatted_address
    //   );
    //   this.vehicleFinderForm.controls['dropOff'].markAsTouched();
  }
  setPickUp(event: any) {
    // this.vehicleFinderForm.controls['pickUp'].setValue(event.formatted_address);
    // this.vehicleFinderForm.controls['pickUp'].markAsTouched();
  }

}

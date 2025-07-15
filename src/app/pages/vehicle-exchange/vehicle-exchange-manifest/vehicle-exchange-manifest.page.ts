import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { selectBooking, selectLeg } from 'src/app/store/bookings.actions';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'vehicle-transfer-manifest',
  templateUrl: './vehicle-exchange-manifest.page.html',
  styleUrls: ['./vehicle-exchange-manifest.page.scss'],
})
export class VehicleTransferManifestScreenPage implements OnInit {
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  todaysBookings: any[] = [];

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.getBookings();
  }




  inspect(leg: any, booking: any, type:string) {
    this.bookingService.delieveryType='';
    console.log('leg', leg);
    console.log('bookingId', booking);
    this.store.dispatch(selectBooking({ booking: booking }));
    this.store.dispatch(selectLeg({ leg: leg }));
    this.bookingService.currentLeg = leg;
    

if(type=="BOOKING COLLECTION"){
  //collection
  this.router.navigateByUrl(
    `/vehicle-inspection/${leg.mvaNumber}/${booking.bookingId}?collection=true`
  );

}else{
  //delivery
  this.router.navigateByUrl(
    `/vehicle-inspection/${leg.mvaNumber}/${booking.bookingId}`
  );
}
    
  }


  getBookings() {
    //NK: todo: pass in agent detailsr
    this.bookingService
      .getBookingManifestByEmployee(this.userService?.user?.employeeNumber)
      .subscribe({
        next: (bookings: any) => {
          //this.initialize(bookings);
          this.todaysBookings = bookings.vehicleExchange; //
          // this.segmentChanged({ detail: { value: 't1' } });
        },
        error: (err: any) => {},
      });
  }

  beginInspection(leg: any) {
    console.log('todays leg', leg);
    this.bookingService.currentLeg = leg;
    leg.mvaNumber = '18924124'; //TODO: Remove
    leg.bookingNumber = '3238671';
    this.router.navigateByUrl(
      `/vehicle-inspection/${leg.mvaNumber}/${leg.bookingNumber}/exchange`
    );
  }

  getTodaysBookings(bookings: any[]): any[] {
    const todaysBookings = bookings.filter((x) => this.isToday(x.pickUpDate));
    return todaysBookings;
  }

  isToday(date: string) {
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate)
      .utc()
      .isSame(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  view(booking: any) {
    console.log(booking);
    this.store.dispatch(selectLeg({ leg: booking }));
    this.router.navigateByUrl('/view-booking');
  }

  //footer
  //footer
   home() {
    this.router.navigateByUrl('/home-screen');
  }

  manifest() {
    this.router.navigateByUrl('/manifest-screen');
  }
  exchange() {
    this.router.navigateByUrl('/vehicle-exchange');
  }
  transfer(){
    this.router.navigateByUrl('/vehicle-scan-licence');
  }
  lostitem() {
    this.router.navigateByUrl('/forgot-item');
  }
  logoff() {
    this.cookieService.delete('avis-user');
    this.router.navigateByUrl('/login');
  }
}

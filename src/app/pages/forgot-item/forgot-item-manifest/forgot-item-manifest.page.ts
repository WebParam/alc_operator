import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { selectBooking, selectLeg } from 'src/app/store/bookings.actions';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'forgot-item-manifest-screen',
  templateUrl: './forgot-item-manifest.page.html',
  styleUrls: ['./forgot-item-manifest.page.scss'],
})
export class ForgotItemManifestScreenPage implements OnInit {

  pastBookings: any[] = [];

  constructor( private bookingService: BookingService,     private cookieService: CookieService, private router:Router, private store: Store) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.bookingService
      .getBookingManifestByEmployee("15808")
      .subscribe(
        (bookings:any) => {
          console.log("data", bookings); 
          //const historic = this.getHistoricBookings(bookings);
          
          this.pastBookings =bookings.historicBookings;
        }
      );
  }

  getHistoricBookings(bookings:any[]):any[]{

    const todaysBookings = bookings.filter(x=> this.isHistoric(x.pickUpDate));
    return bookings;
  }



   isHistoric(date:string){
    
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate).utc().isAfter(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  logitem( booking:any)
  {

    this.store.dispatch(selectBooking({ booking: booking }));


    this.router.navigateByUrl('/forgot-item-capture');
  }

  view(booking:any){
    console.log(booking);
    this.store.dispatch(selectLeg({ leg: booking }));
    this.router.navigateByUrl('/view-booking');
  }
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
  logoff(){
    this.cookieService.get('Test');
    this.router.navigateByUrl('/login');
  }

}

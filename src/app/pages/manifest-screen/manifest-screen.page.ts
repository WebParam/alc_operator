import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { selectBooking, selectLeg } from 'src/app/store/bookings.actions';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';
import { ConfirmationPage } from '../confirmation/confirmation.page';

@Component({
  selector: 'app-manifest-screen',
  templateUrl: './manifest-screen.page.html',
  styleUrls: ['./manifest-screen.page.scss'],
})
export class ManifestScreenPage implements OnInit {
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  todaysBookings: any[] = [];
  allbookings: any[] = [];
  selectedBookings: any[] = [];
  selectedOption:string="";
  message = '';
  selectedTab = 't1';
filteredBookings:any[]=[];
  constructor(
    private bookingService: BookingService,
    private router: Router,
    private userService: UserService,
    private store: Store,
        private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // Still good for one-time setup if needed
  }

  ionViewWillEnter() {
    // This runs every time the page is about to enter and become active
    this.getBookings();
  }

  getBookings() {
    //NK: todo: pass in agent detailsr
    this.bookingService
      .getBookingManifestByEmployee(this.userService?.user?.employeeNumber)
      .subscribe({
        next: (bookings: any) => {
          
          //this.initialize(bookings);
          console.log('data', bookings);
          this.upcomingBookings = bookings.upcomingBookings;
          this.pastBookings = bookings.historicBookings;
          // add todays bookings
          // this.todaysBookings = bookings.ongoingBookings; //.push(bookings.historicBookings[0]); //
          // this.todaysBookings = bookings.historicBookings; //
          
          this.todaysBookings=[...bookings.historicBookings, ...bookings.vehicleTransfer, ...bookings.vehicleExchange]
          this.selectedBookings = this.todaysBookings;
         
          // this.segmentChanged({ detail: { value: 't1' } });
        },
        error: (err: any) => {},
      });
  }


onBookingTypeChange(event: any) {
  const value = event.detail.value;

  let type: string;

  switch (value) {
    case 'ci':
      type = 'collection';
      break;
    case 'co':
      type = 'delivery';
      break;
    case 'ex':
      type = 'exchange';
      break;
    default:
      type = '';
      break;
  }

  this.filterBookings(type);
}



filterBookings(type: string) {
  
  this.filteredBookings = this.todaysBookings.filter((booking: any) => {
    if (type === 'collection') {
      return booking.bookingType === 'booking collection';
    } else if (type === 'delivery') {
      return booking.bookingType === 'booking delivery';
    } else if (type === 'exchange') {
      return booking.bookingType === 'exchange';
    } else if (type === 'transfer') {
      return booking.bookingType === 'vehicle transfer';
    } else {
      return true; // Show all if no filter
    }
  });
  if(type!== ''){
  this.selectedBookings = this.filteredBookings;
  }else{
   this.selectedBookings= this.todaysBookings; 
  }
}


  selectBooking() {}


  segmentChanged(event: any) {
    this.message = '';
    
    this.selectedTab = event.detail.value;
    // switch (event.detail.value) {
    //   case 't1':
        this.selectedBookings = [...this.todaysBookings,...this.upcomingBookings??[],...this.pastBookings];
        this.message =
          this.selectedBookings.length == 0
            ? 'There are no bookings for today'
            : '';
        // break;
      // case 't2':
      //   this.selectedBookings = structuredClone(this.upcomingBookings);
      //   this.message =
      //     this.selectedBookings.length == 0
      //       ? 'There are no upcoming bookings'
      //       : '';
      //   break;
      // case 't3':
      //   this.selectedBookings = structuredClone(this.pastBookings);
      //   this.message =
      //     this.selectedBookings.length == 0
      //       ? 'There are no historical bookings'
      //       : '';
      //   break;
    // }
  }

  getTodaysBookings(bookings: any[]): any[] {
    const todaysBookings = bookings.filter((x) =>
      this.isToday(x.legs[0].pickUpDate)
    );
    return bookings;
  }
  getFutureBookings(bookings: any[]): any[] {
    const todaysBookings = bookings.filter((x) =>
      this.isFuture(x.legs[0].pickUpDate)
    );
    return todaysBookings;
  }
  getHistoricBookings(bookings: any[]): any[] {
    const todaysBookings = bookings.filter((x) =>
      this.isHistoric(x.legs[0].pickUpDate)
    );
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

  isHistoric(date: string) {
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate)
      .utc()
      .isAfter(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  isFuture(date: string) {
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate)
      .utc()
      .isBefore(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  switchNameFormat(input:string) {
  // Match pattern: LASTNAME,FIRSTNAME TITLE
  const match = input.match(/^([^,]+),\s*([^\s]+)\s+(.+)$/);

  if (!match) {
    return 'Invalid format';
  }

  const [, lastName, firstName, title] = match;
  return `${title.toUpperCase()} ${firstName}, ${lastName}`;
}


  checkAccessories(leg: any, booking: any) {
    this.router.navigateByUrl(`/vehicle-accessories/${leg.mvaNumber}`);
  }

  

  skipInspect(leg: any, booking: any) {
    // booking.bookingType = "booking delivery";
    this.bookingService.delieveryType='';
     leg.allocationType= booking.bookingType;
    this.store.dispatch(selectBooking({ booking: booking }));
    this.store.dispatch(selectLeg({ leg: leg }));
    this.bookingService.currentLeg = {...leg, allocationType: booking.bookingType};
    const allocation = booking.bookingType;
    

    if(allocation=="booking collection"){
      //collection
      this.router.navigateByUrl(
          `/driver-navigator`
      );

    }
    if(allocation=="booking delivery"){
      //delivery
      this.router.navigateByUrl(
        `/driver-navigator`
      );
    }

    if(allocation=="exchange"){
      //delivery
      this.router.navigateByUrl(
        `/vehicle-inspection/${leg.vehicleDetails.results[0].replacesMva}/${booking.bookingId}`
      );
    }
  }
  

  inspect(leg: any, booking: any, type:string) {
    // booking.bookingType = "booking delivery";
    this.bookingService.delieveryType='';
     leg.allocationType= booking.bookingType;
    this.store.dispatch(selectBooking({ booking: booking }));
    this.store.dispatch(selectLeg({ leg: leg }));
    this.bookingService.currentLeg = {...leg, allocationType: booking.bookingType};
    const allocation = booking.bookingType;
    

    if(allocation=="booking collection"){
      //collection
      this.router.navigateByUrl(
          `/at-delivery-location`
      );

    }
    if(allocation=="booking delivery"){
      //delivery
      this.router.navigateByUrl(
        `/vehicle-inspection/${leg.mvaNumber}/${booking.bookingId}`
      );
    }

    if(allocation=="exchange"){
      //delivery
      this.router.navigateByUrl(
        `/vehicle-inspection/${leg.vehicleDetails.results[0].replacesMva}/${booking.bookingId}`
      );
    }
  }

  view(booking: any) {
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
  logoff() {
    this.userService.logOut();
    this.router.navigateByUrl('/login');
  }
}

import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'vehicle-transfer-manifest',
  templateUrl: './vehicle-transfer-manifest.page.html',
  styleUrls: ['./vehicle-transfer-manifest.page.scss'],
})
export class VehicleTransferManifestScreenPage implements OnInit {
  upcomingBookings: any[] = [];
  pastBookings: any[] = [];
  todaysBookings: any[] = [];

  constructor( private bookingService: BookingService,    private cookieService: CookieService, private router:Router) { }

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.bookingService
      .getBookings()
      .subscribe(
        (airports:any) => {
          console.log("data", airports); 
          this.todaysBookings = airports.todaysBookings as any[];
        }
      );
  }

  logitem()
  {
    this.router.navigateByUrl('/forgot-item-note');
  }

  scanLicense() {
    this.router.navigateByUrl('/scan-licence');
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
  logoff(){
    this.cookieService.delete("avis-user");
    this.router.navigateByUrl('/login');
  }

  

}

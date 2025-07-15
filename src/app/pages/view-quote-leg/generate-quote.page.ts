import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generate-quote',
  templateUrl: './generate-quote.page.html',
  styleUrls: ['./generate-quote.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GenerateQuotePage {
  booking: any;
  vehicles:any;
  vehicleDetails: any;

  total = 0;
  constructor(private bookingService: BookingService, private router: Router, private store: Store) {
   this.store
      .select((store: any) => store.bookings.inProgressLeg)
      .subscribe((res) => {
        this.booking = res;
        
        this.vehicles= res.vehicleDetails.results;
       
        
        bookingService.getVTC(res.mvaNumber).subscribe((data: any) => {
          this.vehicleDetails = data.UpdateVehicleData;
 console.log("res3",data)

        })
      });
  }



  back(){
    this.router.navigateByUrl('/manifest-screen');
  }
}

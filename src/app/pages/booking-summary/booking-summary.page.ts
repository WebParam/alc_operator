import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-summary',
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.page.scss'],
})
export class BookingSummaryPage implements OnInit {
  delieveryType = '';
  booking: any;
  constructor(private router: Router, private bookingService: BookingService) {
    this.delieveryType = bookingService.delieveryType;
    this.booking = this.bookingService.currentLeg;
  }

  ngOnInit() {}

  sign() {
    this.router.navigateByUrl('/sign');
  }
  viewRentalAgreement() {
    this.router.navigateByUrl('/rental-agreement');
  }
  onAnother() {
    const updatedBooking = {
      ...this.booking,
    };

    this.router.navigateByUrl('/available-booking-types');
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  currentLeg: any = {};
  constructor(private router: Router, private bookingService: BookingService) {
    this.currentLeg = this.bookingService.currentLeg;
  }

  ngOnInit() {}

  close() {
    this.router.navigateByUrl('/at-delivery-location');
  }
}

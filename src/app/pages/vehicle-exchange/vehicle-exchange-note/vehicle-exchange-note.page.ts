import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'vehicle-exchange-note',
  templateUrl: './vehicle-exchange-note.page.html',
  styleUrls: ['./vehicle-exchange-note.page.scss'],
})
export class VehicleTransferNotePage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  cancel()
  {
    this.router.navigateByUrl('/forgot-item');
  }
  capture()
  {
    this.router.navigateByUrl('/forgot-item-capture');
  }

}

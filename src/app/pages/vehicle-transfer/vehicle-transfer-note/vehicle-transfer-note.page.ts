import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'forgot-item-note',
  templateUrl: './vehicle-transfer-note.page.html',
  styleUrls: ['./vehicle-transfer-note.page.scss'],
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

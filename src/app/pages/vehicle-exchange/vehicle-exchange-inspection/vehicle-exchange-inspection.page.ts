import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'vehicle-exchange-inspection',
  templateUrl: './vehicle-exchange-inspection.page.html',
  styleUrls: ['./vehicle-exchange-inspection.page.scss'],
})
export class VehicleExhangeInspectionPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  continue(){
    this.router.navigateByUrl('/driver-navigator');
  }
}

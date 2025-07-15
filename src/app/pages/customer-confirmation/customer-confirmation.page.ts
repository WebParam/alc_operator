import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './customer-confirmation.page.html',
  styleUrls: ['./customer-confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  manifest()
  {
    this.router.navigateByUrl('/manifest-screen');
  }
  inspection()
  {
    this.router.navigateByUrl('/customer-inspection');
  }

}

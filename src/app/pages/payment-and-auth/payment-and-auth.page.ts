import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-and-auth',
  templateUrl: './payment-and-auth.page.html',
  styleUrls: ['./payment-and-auth.page.scss'],
  
})
export class PaymentAndAuthPage implements OnInit {
  
  rows = [
    {
      "Type": "CO",
      "Date": "02/03/2023",
      "Code": "18546",
      "Amount": "R36,954"
    },
    {
      "Type": "EX",
      "Date": "21/06/2023",
      "Code": "96547",
      "Amount":"R89,1241"
    }
  ];
  constructor(private router:Router) {
    
   }

  complete(){
    this.router.navigateByUrl('/rental-agreement');
  }

  ngOnInit() {
  }

  

}

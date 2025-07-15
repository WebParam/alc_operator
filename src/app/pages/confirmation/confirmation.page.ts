import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {

  constructor(private router:Router,
     private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async manifest()
  {
    
    this.router.navigateByUrl('/manifest-screen');
  }
  async inspection()
  {
    this.router.navigateByUrl('/pre-inspection');
  }

 async exchange(){
    this.router.navigateByUrl('/vehicle-exchange');
  }
 async transfer(){
    this.router.navigateByUrl('/vehicle-scan-licence');
  }
}

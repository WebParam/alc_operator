import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Camera, CameraResultType } from '@capacitor/camera';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { IDocument, IDocumentUpload } from 'src/app/store/bookings.actions';
@Component({
  selector: 'forgot-item-capture',
  templateUrl: './forgot-item-capture.page.html',
  styleUrls: ['./forgot-item-capture.page.scss'],
})


export class ForgotItemCapturePage implements OnInit {
webUrl:string="";
booking:any;

  constructor(private router:Router, private bookingService: BookingService, private store: Store) { }

  ngOnInit() {
    this.store
    .select((store: any) => store.bookings.inProgressBooking)
    .subscribe((bookings: any) => {
      console.log("bpplomg", bookings)
    this.booking = bookings;    
    });
  }

  
  takePicture(){
    const image = Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    }).then(x=> this.webUrl = x.webPath??"")

  };



  savePicture(){


    fetch(this.webUrl).then((r) =>{ 
       r.blob().then(blob=>{

        const payload = new FormData();        
        payload.append("file", blob)
        payload.append("wizardNumber",this.booking?.customer?.passengerWizardNo)

        this.bookingService.postForgottenItem(payload, this.booking?.bookingId).subscribe({
    
          next: (response:any) => {
            console.log("Document upload response", response)
          }
        })
      });
    })

    this.router.navigateByUrl('/forgot-item');
  
  
  }
  cancel(){
    this.router.navigateByUrl('/forgot-item');
   
  }
}

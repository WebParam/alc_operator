import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Camera, CameraResultType } from '@capacitor/camera';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { IDamage, setNewDamages } from 'src/app/store/bookings.actions';
@Component({
  selector: 'app-capture',
  templateUrl: './capture.page.html',
  styleUrls: ['./capture.page.scss'],
})


export class CapturePage implements OnInit {
webUrl:string="";
newDamages: IDamage[]=[];
position:string = "";

  constructor(private router:Router, private store: Store, private route: ActivatedRoute) { }

  ngOnInit() {

  //get damages from store
    this.store
    .select((store: any) => store.bookings.newDamages)
    .subscribe((damages: any) => {
      console.log("da,", damages)
    this.newDamages = damages??[];    
    });

    this.route.params.subscribe((params) => {
      const employeeId = params["id"];
      this.position = employeeId;
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

    const damage = {
      id:UUID.UUID(),
      damageDescription:"a description",
      damageLocation:this.position,
      damageImage:this.webUrl,
      isNew:true
    } as IDamage;

    const newDamages =[...this.newDamages, damage] as IDamage[];
    this.store.dispatch(setNewDamages({newDamages}));
    this.router.navigateByUrl('/pre-inspection');
  }

  cancel(){
    this.router.navigateByUrl('/pre-inspection');
   
  }
}

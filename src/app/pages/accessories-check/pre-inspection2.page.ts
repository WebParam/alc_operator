import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IDamage, setNewDamages } from 'src/app/store/bookings.actions';
import { UUID } from 'angular2-uuid';
@Component({
  selector: 'app-pre-inspection2',
  templateUrl: './pre-inspection2.page.html',
  styleUrls: ['./pre-inspection2.page.scss'],
})
export class PreInspection2Page implements OnInit {

  booking:any;
  leg:any;

  missingAccessories: IDamage[]=[]
  allDamages : IDamage[] = [];

  constructor(private router:Router,  private store: Store) { }

  ngOnInit() {
    this.store
    .select((store: any) => store.bookings.inProgressBooking)
    .subscribe((bookings: any) => {
    this.booking = bookings;    
    });

    this.store
    .select((store: any) => store.bookings.inProgressLeg)
    .subscribe((leg: any) => {
    this.leg = leg;    
    });

    this.store
    .select((store: any) => store.bookings.newDamages)
    .subscribe((damages: any) => {
      this.allDamages = damages;
      const accessories = this.getAccessories(damages);
      this.missingAccessories = accessories;
    });


  }

  getAccessories(damages : IDamage[]){
    
    return this.missingAccessories = damages.filter(
      x=>x.damageLocation != "back" &&
      x.damageLocation!="front" &&
      x.damageLocation!="front-left" &&
      x.damageLocation!="front-right" &&
      x.damageLocation!="back-right" &&
      x.damageLocation!="back-left" &&
      x.damageLocation!="roof" &&
      x.damageLocation!="front-seat"&&
      x.damageLocation!="back-seat" 
      )
  }

  markAsMissing(accessory:any){

    const isMissing = this.missingAccessories.filter(x=>x.damageLocation == accessory.code).length !=0;
    if(isMissing){

      const removed = this.missingAccessories.filter(x=>x.damageLocation!=accessory.code);
      this.missingAccessories = removed;
      const removedDamage = this.allDamages.filter(x=>x.damageLocation!=accessory.code);
      this.store.dispatch(setNewDamages({ newDamages: removedDamage }));
      
    }else{

      const damage = {
        id:UUID.UUID(),
        damageLocation:accessory.code, 
        damageDescription:`Missing description: ${accessory.description}`,
        damageImage:"",
        isNew:true
      } as IDamage
  
      const updatedAccessories = [...this.missingAccessories, damage];
      this.missingAccessories = updatedAccessories;
      const _allDamages = [...this.allDamages, damage];
      this.store.dispatch(setNewDamages({ newDamages: _allDamages }));

    }
  }


//updated damages
  isChecked(code:string){
    
    this.missingAccessories.filter(x=>x.damageLocation == code).length !=0;


  }

  continue(){
    this.router.navigateByUrl('/driver-navigator');
    
  }
}

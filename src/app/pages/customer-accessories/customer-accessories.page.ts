import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IDamage, setNewDamages } from 'src/app/store/bookings.actions';
import { UUID } from 'angular2-uuid';
import { VehicleService } from 'src/app/services/vehicle.service';
import { BookingService } from 'src/app/services/booking.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-customer-accessories',
  templateUrl: './customer-accessories.page.html',
  styleUrls: ['./customer-accessories.page.scss'],
})
export class CustomerAccessoriesPage implements OnInit {

  booking:any;
  leg:any;

  _bookingService: BookingService;
  missingAccessories: IDamage[]=[]
  allDamages : IDamage[] = [];
  apiResponse: any;
  mva = '';

  constructor(private router:Router,  private store: Store,private vehicleService: VehicleService,bookingService:BookingService,  
      private route: ActivatedRoute, 
          private toastController: ToastController) {
        this._bookingService = bookingService;

    this.route.params.subscribe((params) => {
      this.mva = params['mva'];
      
      vehicleService.getVehicleVTC(this.mva).subscribe((result: any) => {
        
        console.log(result);
         debugger;
          this.presentAlert()
        if (result?.result?.vehicleAccessorsOutput?.results) {
          var res = result?.result?.vehicleAccessorsOutput.results.map((r: any) => {
            return {
              ...r,
              accessoryFound2: r.accessoryFound == 'Y' ? true : false,
            };
          });
         
         
          this.apiResponse = res;
        }
      });
    });



   }

     async presentAlert() {
     const toast = await this.toastController.create({
      message: 'Please perform inspection of vehicle with customer.',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();

  }

   ngOnInit() {
    // this.router.navigateByUrl(`/pre-inspection/${this.mva}`);
  }

  // continue() {
  //   this.router.navigateByUrl('/driver-navigator');
  // }
  update() {
    
    console.log(this.apiResponse);
    let counter = 0;
    const accessories: any = [];
    this.apiResponse?.forEach((item: any) => {
      const payload = {
        guid: item.guid,
        mva: item.mva,
        accessorySpecification: item.accessorySpecification,
        accessoryValue: item.accessoryValue,
        accessoryFound: item.accessoryFound2 ? 'Y' : 'N',
      };
      accessories.push(payload);
    });
    this.vehicleService.vehicleAccessories = accessories;
    this.router.navigateByUrl(`/customer-inspection/${this.mva}`);
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
    console.log("CUS ACC",code)
    this.missingAccessories.filter(x=>x.damageLocation == code).length !=0;


  }

  continue(){
    this.router.navigateByUrl('/rental-agreement');    
  }
}

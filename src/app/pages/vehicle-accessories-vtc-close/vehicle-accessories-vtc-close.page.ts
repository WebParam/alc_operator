import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-accessories',
  templateUrl: './vehicle-accessories-vtc-close.page.html',
  styleUrls: ['./vehicle-accessories-vtc-close.page.scss'],
})
export class VehicleAccessoriesPage implements OnInit {
  apiResponse: any;
  mva = '';
  isVtc = false;
  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
  
    this.route.params.subscribe((params) => {
      this.mva = params['mva'];
      const isVtc = this.route.snapshot.queryParamMap.get('vtc');
      this.isVtc = isVtc === 'true' ? true : false;
      vehicleService.getVehicleVTCBasic(this.mva).subscribe((result: any) => {
        
        console.log(result);
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

  
  


  ngOnInit() {
    
    // this.router.navigateByUrl(`/pre-inspection/${this.mva}`);
  }

  continue() {
    this.router.navigateByUrl('/driver-navigator');
  }
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
    
    
    this.router.navigateByUrl(`/pre-inspection-vtc-close/${this.mva}`);
  

  }
}

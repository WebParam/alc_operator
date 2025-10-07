import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { VehicleService } from 'src/app/services/vehicle.service';
import { IDamage, setNewDamages } from 'src/app/store/bookings.actions';
import { CapturePage } from '../capture/capture.page';
import { BookingService } from 'src/app/services/booking.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-pre-inspection',
  templateUrl: './pre-inspection-replacement.page.html',
  styleUrls: ['./pre-inspection-replacement.page.scss'],
})
export class PreInspectionPage implements OnInit {
  allVehicleDamages: any[] = [];
  updatedDamages: any[] = [];
  frontDamages: any[] = [];
  backDamages: any[] = [];
  frontLeftDamages: any[] = [];
  frontRightDamages: any[] = [];
  backRightDamages: any[] = [];
  backLeftDamages: any[] = [];
  frontSeatDamages: any[] = [];
  backSeatDamages: any[] = [];
  roofDamages: any[] = [];
  currentLeg: any = {};
  removedDamages: any[] = [];
  deliveryType = '';
  newDamages: any[] = [];
  baseUrl = environment.baseUrl;
  odo =0;
  fuel="G1";
  registration="";
  mva = '';
  apiResponse: any;
  lastStep :any = false;
  isVtc = false;
  userCapturedDamages: Set<string> = new Set(); // Track which damages user has captured
  originalImages: Map<string, any> = new Map(); // Store original images separately
  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private bookingService: BookingService,
    private http: HttpClient
  ) {
    
    this.currentLeg = this.bookingService.currentLeg;
    const isVtc = this.route.snapshot.queryParamMap.get('vtc');
    this.isVtc = isVtc === 'true' ? true : false;
    this.lastStep = this.bookingService.delieveryType =='BOOKING COLLECTION' || this.bookingService.delieveryType =='EXCHANGE' ? true : false;
    this.route.params.subscribe((params) => {
      this.mva = params['mva'];
      vehicleService.getVehicleVTC(this.mva).subscribe((result: any) => {
        console.log(result);
        const accessories = this.vehicleService.vehicleAccessories;
        
        if (result?.result?.vehicleQcheckOutput?.results) {
         
          var res = result?.result?.vehicleQcheckOutput.results.map((r: any) => {
            return {
              ...r,
              accessoryFound2: r.accessoryFound == 'Y' ? true : false,
            };
          });
          
          this.apiResponse = res;
          
          // Store original images for each damage location
          res.forEach((damage: any) => {
            if (damage.image || damage.base64Image) {
              this.originalImages.set(damage.damageLocation, {
                image: damage.image,
                base64Image: damage.base64Image,
                damageRemark: damage.damageRemark
              });
            }
          });
        }
      });
    });
  }

  ionViewWillEnter() {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      
      // Format GPS location as "latitude,longitude"
      this.vehicleService.gpsLocation = `${coordinates.coords.latitude},${coordinates.coords.longitude}`;
      
      console.log('GPS Location:', this.vehicleService.gpsLocation);
    } catch (error) {
      console.error('Error getting GPS location:', error);
      this.vehicleService.gpsLocation = "0,0"; // Default fallback
    }
  }

  
deleteDamage(damage:any){
  
  // Remove user-captured image
  damage.userImage = null;
  damage.userDescription = null;
  damage.dmsEntryId ="0";

  // Remove from user captured damages set
  this.userCapturedDamages.delete(damage.damageLocation);

  var target = this.apiResponse.filter((x:any)=>x.damageLocation.trim() == damage.damageLocation.trim())[0];
  const newTarget = {...target, dmsEntryId: "0"};
  var newarray = this.apiResponse.filter((x:any)=>x.damageLocation.trim() != damage.damageLocation.trim());
  this.apiResponse = [...newarray, newTarget];

  //this.apiResponse = this.apiResponse.filter((x:any)=>{return x.dmsEntryId.length>1;});

}

  getDamages() {
    this.vehicleService.getDamages().subscribe((damages: any) => {
      const _allDamages = damages.damagesList as any[];
      this.allVehicleDamages = _allDamages;
      // this.updateDamages(_allDamages);
      // this.store.dispatch(setNewDamages({ newDamages: _allDamages }));
    });
  }

  //update store
  removeDamage(id: any) {
    const _allDamages = this.allVehicleDamages.filter(
      (x) => x.id != id
    ) as IDamage[];
    this.allVehicleDamages = _allDamages;
    
    // this.store.dispatch(setNewDamages({ newDamages: _allDamages }));
  }

  async capture(damage: any) {
    // Pass existing damage data to the modal for editing
    const modal = await this.modalCtrl.create({
      component: CapturePage,
      componentProps: {
        existingImage: damage.userImage || (damage.base64Image ? `data:image/png;base64,${damage.base64Image}` : null),
        existingDescription: damage.userDescription || damage.damageRemark || ''
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (data && data.damageImage) {
      console.log('data', data);
      
      // Store user-captured image separately
      damage.userImage = data?.damageImage;
      damage.userDescription = data?.damageDescription;
      
      // Track that user has captured this damage
      this.userCapturedDamages.add(damage.damageLocation);
      
      damage.files = damage.files
        ? [...damage.files, data.damageImage]
        : [data.damageImage];
      const response = await fetch(data.damageImage);
      const fileData = await response.blob();
      console.log(fileData);
      this.saveDamange(damage, fileData);
    }
  }

  saveDamange(damange: any, file: any) {
    const updatedDamage = this.updatedDamages.find(
      (d) => d.damageLocation == damange.damageLocation
    );
    if (updatedDamage) {
    } else {
      this.updatedDamages.push(damange);
    }
 
  }

  async createBlobFromLocalURL(url:string, fileName:string) {
    try {
      // Fetch the data from the local URL
      const response = await fetch(url);
  
      // Ensure the fetch was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
  
      // Convert the response into a Blob
      const blob = await response.blob();
      // Create a File from the Blob with the specified name
      const file = new File([blob], fileName, { type: blob.type });

      return file; // Return the Blob
    } catch (error) {
      console.error("Error creating Blob from local URL:", error);
      throw error; // Re-throw error to handle it elsewhere if needed
    }
  }

  async uploadDamages(){

  }

  // Validation method to check if all required images are uploaded
  validateAllImagesUploaded(): boolean {
    if (!this.apiResponse || this.apiResponse.length === 0) {
      return true; // No damages to validate
    }

    // Check if user has captured images for all damage locations
    const missingImages = this.apiResponse.filter((damage: any) => 
      !this.userCapturedDamages.has(damage.damageLocation)
    );

    return missingImages.length === 0;
  }

  // Method to get missing image locations for user feedback
  getMissingImageLocations(): string[] {
    if (!this.apiResponse) return [];
    
    return this.apiResponse
      .filter((damage: any) => !this.userCapturedDamages.has(damage.damageLocation))
      .map((damage: any) => damage.damageLocation);
  }

  async showValidationToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  
  async continue() {
    // Validate that all required images are uploaded
    if (!this.validateAllImagesUploaded() && environment.validation.live) {
      const missingLocations = this.getMissingImageLocations();
      const message = `Please upload images for the following locations: ${missingLocations.join(', ')}`;
      await this.showValidationToast(message);
      return; // Stop execution if validation fails
    }
    // this.router.navigateByUrl('/accessories-check');
    this.vehicleService.vehiclesDamages = this.updatedDamages;
  
    var t = this.updatedDamages
    const payload = new FormData();
    
    const blobs = await Promise.all(
      this.updatedDamages.map(async (img: any, index: number) => {
        
        return await this.createBlobFromLocalURL(img.userImage || img.image, img.damageLocation);
      })
    );

      blobs.map((x, index)=>{
        
        
        payload.append(`images${index}`, x);
      });
      

      
      const meta = this.apiResponse.filter((x:any)=>{return x.dmsEntryId.length>1;})
      const meta2 = meta.map((x:any)=>{return {...x, base64Image:""}});


      const fullQCheck = [...this.updatedDamages, ...meta2];

      const jsonData = {
        mva:this.mva,
        stageNumber:this.currentLeg?.stageNumber,
        bookingId:this.currentLeg?.bookingNumber,
        vehicleAccessories: this.vehicleService.vehicleAccessories,
        VehicleQCheck: fullQCheck,
        gpsLocation: this.vehicleService.gpsLocation,
      };
     
     
      payload.append('data', JSON.stringify(jsonData));
      payload.append('stageNumber', this.currentLeg?.stageNumber);
      payload.append('bookingId', this.currentLeg?.bookingNumber);
  
      

      this.http.post(`${this.baseUrl}Vehicles/damages`, payload
        // {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // }
      )
      .subscribe((result) => {
        //customer inspection with new mva
        const p = this.bookingService.currentLeg;
        const res = p.vehicleDetails.results[0].replacesMva
        
        this.router.navigateByUrl(`/rental-agreement/${p.bookingNumber}/${p.mvaNumber}`);
        //  this.router.navigateByUrl(`/customer-accessories/${res}`);
// rental-agreement-replacement/:id
      });

    // });



    
  }
}

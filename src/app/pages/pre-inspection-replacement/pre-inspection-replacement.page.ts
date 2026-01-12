import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
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
  isDataLoaded = false;
  userCapturedDamages: Set<string> = new Set(); // Track which damages user has captured
  originalImages: Map<string, any> = new Map(); // Store original images separately
  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private bookingService: BookingService,
    private http: HttpClient,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    
    this.currentLeg = this.bookingService.currentLeg;
    const isVtc = this.route.snapshot.queryParamMap.get('vtc');
    this.isVtc = isVtc === 'true' ? true : false;
    this.lastStep = this.bookingService.delieveryType =='BOOKING COLLECTION' || this.bookingService.delieveryType =='EXCHANGE' ? true : false;
  }

  ionViewWillEnter() {
    // Always reload fresh data to ensure images are present
    this.isDataLoaded = false;
    this.apiResponse = null; // Clear previous data
    this.loadDamageData();
  }

  loadDamageData() {
    // Get mva directly from route snapshot to avoid multiple subscriptions
    this.mva = this.route.snapshot.params['mva'];
    
    this.vehicleService.getVehicleVTC(this.mva).subscribe((result: any) => {
      console.log('VTC API Response:', result);
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
        
        // Small delay to ensure images are ready to render
        setTimeout(() => {
          this.isDataLoaded = true;
        }, 300);
      }
    }, (error) => {
      console.error('Error loading damage data:', error);
      this.isDataLoaded = true; // Show page even on error
    });
  }

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
    await modal.present();

    // Use onDidDismiss instead of onWillDismiss to ensure modal is fully closed
    // This fixes tablet issues where the thumbnail wouldn't appear on first capture
    const { data, role } = await modal.onDidDismiss();
    
    if (data && data.damageImage) {
      console.log('data', data);
      
      // Compress image immediately when captured to prevent memory issues later
      let compressedImageUrl = data.damageImage;
      try {
        const response = await fetch(data.damageImage);
        const originalBlob = await response.blob();
        
        // Always compress on capture to reduce memory footprint
        if (originalBlob.type.startsWith('image/')) {
          const compressedBlob = await this.compressImageBlob(originalBlob, 1280, 1280, 0.75);
          // Revoke old blob URL to free memory
          if (data.damageImage.startsWith('blob:')) {
            URL.revokeObjectURL(data.damageImage);
          }
          compressedImageUrl = URL.createObjectURL(compressedBlob);
        }
      } catch (compressErr) {
        console.warn('Compression on capture failed, using original', compressErr);
      }
      
      // Store compressed image
      damage.userImage = compressedImageUrl;
      damage.userDescription = data?.damageDescription;
      
      // Track that user has captured this damage
      this.userCapturedDamages.add(damage.damageLocation);
      
      damage.files = damage.files
        ? [...damage.files, compressedImageUrl]
        : [compressedImageUrl];
      const response2 = await fetch(compressedImageUrl);
      const fileData = await response2.blob();
      console.log(fileData);
      this.saveDamange(damage, fileData);
      
      // Manually trigger change detection to ensure thumbnail appears on tablets
      this.cdr.detectChanges();
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
      // If the blob is large, compress it (resize + reduce quality)
      const COMPRESS_THRESHOLD = 500 * 1024; // 500KB
      let finalBlob: Blob = blob;

      try {
        if (blob.size > COMPRESS_THRESHOLD && blob.type.startsWith('image/')) {
          finalBlob = await this.compressImageBlob(blob, 1280, 1280, 0.75);
        }
      } catch (compressErr) {
        console.warn('Image compression failed, using original blob', compressErr);
        finalBlob = blob;
      }

      // Create a File from the (possibly compressed) Blob with the specified name
      const fileType = finalBlob.type || 'image/jpeg';
      const file = new File([finalBlob], fileName, { type: fileType });

      // Clean up blob URL if it's a blob URL to free memory
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }

      return file; // Return the File
    } catch (error) {
      console.error("Error creating Blob from local URL:", error);
      throw error; // Re-throw error to handle it elsewhere if needed
    }
  }

  /**
   * Compress an image Blob by drawing it to a canvas, scaling down and
   * exporting as JPEG (or keeping original mime if not provided).
   */
  private compressImageBlob(blob: Blob, maxWidth = 500, maxHeight = 500, quality = 0.4): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          try {
            let { width, height } = img;

            // Calculate target dimensions while keeping aspect ratio
            const aspect = width / height;
            if (width > maxWidth) {
              width = maxWidth;
              height = Math.round(width / aspect);
            }
            if (height > maxHeight) {
              height = maxHeight;
              width = Math.round(height * aspect);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(url);
              return reject(new Error('Could not get canvas context'));
            }

            // Draw the image into the canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Prefer JPEG for better compression unless original is PNG with transparency
            const useType = 'image/jpeg';

            canvas.toBlob((resultBlob) => {
              URL.revokeObjectURL(url);
              if (resultBlob) {
                resolve(resultBlob);
              } else {
                reject(new Error('Canvas toBlob returned null'));
              }
            }, useType, quality);
          } catch (err) {
            URL.revokeObjectURL(url);
            reject(err);
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image for compression'));
        };
        img.src = url;
      } catch (err) {
        reject(err);
      }
    });
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

  async showErrorAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
      cssClass: 'alertAvis',
    });
    await alert.present();
  }

  /**
   * Process images one at a time to prevent memory overflow on low-RAM devices
   */
  private async processImagesSequentially(): Promise<File[]> {
    const files: File[] = [];
    
    for (const img of this.updatedDamages) {
      const file = await this.createBlobFromLocalURL(
        img.userImage || img.image, 
        img.damageLocation
      );
      files.push(file);
      
      // Give browser time to garbage collect between images
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return files;
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
    
    let blobs: File[];
    try {
      // Process sequentially instead of Promise.all to prevent memory spikes on low-RAM devices
      blobs = await this.processImagesSequentially();
    } catch (error) {
      console.error('Error processing images:', error);
      await this.showErrorAlert('Image Processing Error', 'Failed to process images. Please try again or retake the photos.');
      return;
    }

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

      this.http.post(`${this.baseUrl}Vehicles/damages`, payload)
      .subscribe({
        next: (result) => {
          const p = this.bookingService.currentLeg;
          this.router.navigateByUrl(`/replacement-agreement/${p.bookingNumber}/${p.mvaNumber}`);
        },
        error: async (error) => {
          console.error('Error uploading damages:', error);
          if (error.status === 401 || error.status === 403) {
            await this.showErrorAlert('Session Expired', 'Your session has expired. Please log in again.');
          } else if (error.status === 0) {
            await this.showErrorAlert('Network Error', 'Unable to connect to server. Please check your internet connection and try again.');
          } else if (error.status === 413) {
            await this.showErrorAlert('Upload Failed', 'Images are too large. Please retake photos with lower quality.');
          } else {
            await this.showErrorAlert('Upload Failed', 'Failed to upload inspection data. Please try again.');
          }
        }
      });

  }
}

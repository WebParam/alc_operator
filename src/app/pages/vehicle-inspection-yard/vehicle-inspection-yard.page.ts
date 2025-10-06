import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection-yard.page.html',
  styleUrls: ['./vehicle-inspection-yard.page.scss'],
})
export class VehicleInspectionPage implements OnInit {
  form = this.fb.group({
    odoMeter: ['', [Validators.required, this.odometerValidator()]],
    fuelLevel: ['', [Validators.required]],
    mva: ['', [Validators.required]],
    regConfirmed: [false, [Validators.requiredTrue]],
    bookingId: ['', [Validators.required]]
  });
  minOdoMeter = 0;
  regNumber = '';
  bookingId = '';
  _bookingId = '';
  mva = '';
  currentLeg: any = {};
  showNoshow:boolean=true;
  deliveryType = '';
  constructor(
    private bookingService: BookingService,
     private alertController: AlertController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.mva = params['mva'];
 
      this.deliveryType = params['delivery-type'];
      const mva = parseInt(this.mva);
       const type = this.route.snapshot.queryParamMap.get('type');
this.deliveryType = type ?? this.deliveryType;
       this.currentLeg = this.bookingService.currentLeg;
  
      bookingService.getVTC(mva).subscribe((data: any) => {
        console.log(data);
        this.presentAlert();
        this.form.controls.fuelLevel.setValue(
          data.UpdateVehicleData?.fuelLevel?.trim() ?? ''
        );
        this.form.controls.odoMeter.setValue(
          data.UpdateVehicleData?.lastOdo ?? ''
        );
        this.form.controls.mva.setValue(
          data?.UpdateVehicleData?.mva ?? this.mva
        );
        
        this.form.controls.bookingId.setValue(
          data?.UpdateVehicleData?.bookingNumber ?? this.mva
        );

        this.minOdoMeter = data?.UpdateVehicleData?.lastOdo;
        this.regNumber = data?.UpdateVehicleData?.registration;
      });
    });
  }

    async presentAlert() {
     const toast = await this.toastController.create({
      message: 'Please perform yard inspection of vehicle.',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();

  }

  ngOnInit() {}

  odometerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || value === '') {
        return null; // Let required validator handle empty values
      }
      
      const numericValue = parseInt(value);
      if (isNaN(numericValue)) {
        return { invalidNumber: true };
      }
      
      if (numericValue <= this.minOdoMeter) {
        return { odometerTooLow: true };
      }
      
      return null;
    };
  }

  updateVehicleData() {
    console.log(this.form.value);
    console.log(this.form.valid);
    
    let payload = this.form.value as any;
    payload.mva = this.currentLeg.mvaNumber;
    payload.bookingId = this.currentLeg.bookingNumber;
    payload.type="CUSTOMER INSPECTION";
    payload.stage = this.currentLeg.stageNumber;
    if (this.form.invalid) {
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      return;
    } else {
      this.bookingService
        .updateVehicleData(this.form.value)
        .subscribe(async (res) => {
          const toast = await this.toastController.create({
            message: 'Vehicle data updated',
            duration: 1500,
            position: 'bottom',
          });

          await toast.present();
          console.log(res);
          this.navigate();
        });
    }
  }


 async markAsNoShow() {
    const alert = await this.alertController.create({
      header: 'Confirm no show?',
      subHeader: 'This will confirm the booking as a no show',
      message: 'Confirming no show will mark booking as cancelled',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'OK',
          handler: () => {
            this.route.params.subscribe((params: any) => {
              const bId = params['bookingId'];
              this.bookingService.postNoShow(bId, '1', this.mva).subscribe(() => {
                this.router.navigateByUrl('/manifest-screen');
              });
            });
          },
        },
      ],
      cssClass: 'alertAvis',
    });

    await alert.present();
  }


  navigate() {
    
  //  if( this.bookingService.delieveryType=="BOOKING COLLECTION"){
      this.router.navigateByUrl(
        `/vehicle-accessories-yard/${this.form.controls.mva.value}`
      );
    // }
  }
}

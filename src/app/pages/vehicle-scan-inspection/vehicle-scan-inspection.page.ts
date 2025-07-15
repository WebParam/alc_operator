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

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-scan-inspection.page.html',
  styleUrls: ['./vehicle-scan-inspection.page.scss'],
})
export class VehicleScanInspectionPage implements OnInit {
  form = this.fb.group({
    odoMeter: ['', [Validators.required]],
    fuelLevel: ['', [Validators.required]],
    mva: ['', [Validators.required]],
    regConfirmed: [false, [Validators.requiredTrue]],
    bookingId: ['', [Validators.required]],
    //login_reg_test:[],
  });
  minOdoMeter = 0;
  regNumber = '';
  bookingId = '';
  _bookingId = '';
  mva = '';
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

      // const mva = parseInt(this.mva);
      // this.form.controls.bookingId.setValue(params['bookingId']);
      
   bookingService.getVTCFromRegistration(this.mva).subscribe({
  next: (data: any) => {
    console.log('VTC data:', data);
        // Success case - Update form values
        this.form.controls.fuelLevel.setValue(
          data.UpdateVehicleData?.fuelLevel?.trim() ?? ''
        );
        this.form.controls.odoMeter.setValue(
          data.UpdateVehicleData?.lastOdo ?? ''
        );
        this.form.controls.mva.setValue(
          data?.UpdateVehicleData?.mva ?? this.mva
        );
        this.minOdoMeter = data?.UpdateVehicleData?.lastOdo;
        this.regNumber = data?.UpdateVehicleData?.registration;
        this.bookingId = '5379676';
        this.form.controls.bookingId.setValue('5379676');
      },
      error: async (err) => {
        // Error case - Log or display an error message
        console.error('Error fetching VTC data:', err);
         const toast = await this.toastController.create({
            message: `Failed to fetch vehicle details for reg: ${this.mva}`,
            duration: 1500,
            position: 'bottom',
          });

          await toast.present();
        this.router.navigateByUrl('/vehicle-scan-licence');
      },
      complete: () => {
        // Optional: Runs when the observable completes (no errors)
        console.log('VTC data fetch completed');
      }
    });
    });
  }

  ngOnInit() {}
  updateVehicleData() {
    console.log(this.form.value);
    console.log(this.form.valid);
    
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
  checkOdo() {
    try {
      const reading = parseInt(this.form.controls.odoMeter.value ?? '0');
      if (reading <= this.minOdoMeter) {
        this.form.controls.odoMeter.setValue(this.minOdoMeter.toString());
      }
    } catch (e) {
      this.form.controls.odoMeter.setValue(this.minOdoMeter.toString());
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
    // this.router.navigateByUrl('/driver-navigator');
    

  
      this.router.navigateByUrl(
        `/vehicle-accessories/${this.form.controls.mva.value}?vtc=true`
      );
    

  }
}

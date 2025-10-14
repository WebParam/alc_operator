import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BookingService } from 'src/app/services/booking.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-at-delivery-location',
  templateUrl: './at-delivery-location.page.html',
  styleUrls: ['./at-delivery-location.page.scss'],
})
export class AtDeliveryLocationPage implements OnInit {
  currentLeg: any = {};
  leg: any;
  isCol: boolean = false;

  form!: FormGroup;
  minOdoMeter = 0;
  vehicleDetails: any;
  currentDateTime: string = '';

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private userService: UserService,
    private toastController: ToastController,
  ) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      odoMeter: [
        0,
        [Validators.required, this.odometerValidator()],
      ],
      fuelLevel: ["G1", Validators.required],
    });

    this.currentLeg = this.bookingService.currentLeg;
    
    // Set current date and time
    this.currentDateTime = new Date().toLocaleString();
    
    this.vehicleService.getVehicleVTCBasic(this.currentLeg.mvaNumber).subscribe((result: any) => {
      this.vehicleDetails = result.result.getVehicleDataWithVTCOutput;

      this.minOdoMeter = this.vehicleDetails.lastOdo || 0;

      // Update the validator with the new min value
      this.form.get('odoMeter')?.setValidators([
        Validators.required,
        this.odometerValidator(),
      ]);
      this.form.get('odoMeter')?.updateValueAndValidity();

      this.form.patchValue({
        odoMeter: this.minOdoMeter,
        fuelLevel: this.vehicleDetails.fuelLevel || 'G1',
      });

      // Mark form as touched to show validation errors immediately
      this.form.markAsDirty();
      this.form.markAllAsTouched();
    });

  }

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
              const user = this.userService?.user?.employeeNumber;
              const bId = parseInt(this.currentLeg.bookingNumber) || params['bookingId'];
              const stageNumber = parseInt(this.currentLeg.stageNumber) || params['stageNumber'];

              this.bookingService
                .postNoShow(bId, stageNumber, this.bookingService.currentLeg.mvaNumber, user)
                .subscribe(() => {
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

  board() {
    this.router.navigateByUrl('/board');
  }

  inspection() {
    const isDel = this.bookingService.delieveryType == 'BOOKING COLLECTION';
    const mva = this.currentLeg?.mvaNumber;

    this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';


    if (isDel) {
      this.router.navigateByUrl(
        `/vehicle-inspection/${mva}/${this.currentLeg?.bookingNumber}`
      );
    } else {
      this.router.navigateByUrl(`/customer-accessories/${mva}`);
    }
  }

  replacementInspection(mva: string) {
    const replacesMva = this.bookingService._currentLeg.vehicleDetails.results[0].replacesMva;
    this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';
debugger;
    this.router.navigateByUrl(
      `/vehicle-inspection-replacement/${replacesMva}/${this.currentLeg?.bookingNumber}`
    );
  }

  collectionNavigation(mva: string) {
    this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';

    this.router.navigateByUrl(
      `/customer-accessories/${mva}`
    );
  }

  updateVehicleData() {
    console.log(this.form.value);
    console.log(this.form.valid);

    let payload = this.form.value;
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
        .updateVehicleData(payload)
        .subscribe(async (res) => {
          const toast = await this.toastController.create({
            message: 'Vehicle data updated',
            duration: 1500,
            position: 'bottom',
          });

          await toast.present();
          this.router.navigateByUrl('/scan-licence');
        });
    }
  }


  scanLicense() {
    if (this.form.valid) {
      this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
      this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';
      this.updateVehicleData();
    } else {
      // Mark form as touched to show validation errors
      this.form.markAsDirty();
      this.form.markAllAsTouched();
    }
  }
}

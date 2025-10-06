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
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection.page.html',
  styleUrls: ['./vehicle-inspection.page.scss'],
})
export class VehicleInspectionPage implements OnInit {
    currentLeg: any = {};

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
  vehicledata: any;
  deliveryType = '';
  
  constructor(
   
    private bookingService: BookingService,
     private alertController: AlertController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
     private vehicleService: VehicleService,
  ) {
    this.route.params.subscribe((params) => {
      this.mva = params['mva'];
      this.bookingId = params['bookingId'];
      this._bookingId = params['bookingId'];
      this.deliveryType = params['delivery-type'];
      const mva = parseInt(this.mva);
      this.form.controls.bookingId.setValue(params['bookingId']);
      const type = this.route.snapshot.queryParamMap.get('type');
      this.deliveryType = type ?? this.deliveryType;
          this.currentLeg = this.bookingService.currentLeg;
      bookingService.getVTC(mva).subscribe((data: any) => {
        console.log(data);
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
        this.vehicledata = data;
      });
    });
  }

  ngOnInit() {}
  updateVehicleData() {
    console.log(this.form.value);
    console.log(this.form.valid);

      let payload = {...this.form.value} as any;
    payload.mva = this.currentLeg.mvaNumber;
    payload.bookingId = this.currentLeg.bookingNumber;
    payload.type="PRE INSPECTION";
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
          console.log(res);
          this.navigate();
        });
    }
  }
  checkOdo() {
    try {
      const reading = parseInt(this.form.controls.odoMeter.value ?? this.vehicledata.UpdateVehicleData?.lastOdo );
      if (reading < this.minOdoMeter) {
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
    
    this.vehicleService.lastOdo = parseInt(this.form.controls.odoMeter.value?? '0');
    
    this.vehicleService.lastFuel = this.form.controls.fuelLevel.value??"G1";

    var isDel = this.bookingService.currentLeg.allocationType.trim();
    
    switch (isDel) { 
      case 'exchange':
      // case 'BOOKING COLLECTION':
        this.router.navigateByUrl(
          `/vehicle-accessories-new-vehicle/${this.form.controls.mva.value}`
        );
        break;
        case 'booking collection':
        // case 'BOOKING DELIVERY':
          this.router.navigateByUrl(
            `/driver-navigator`
          );
          break;
        default:
          this.router.navigateByUrl(
            `/vehicle-accessories/${this.form.controls.mva.value}`
          );
      // }
    }
  }
}

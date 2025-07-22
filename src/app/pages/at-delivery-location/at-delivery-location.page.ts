import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  vehicleDetails:any;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private fb: FormBuilder,
     private vehicleService: VehicleService,
      private userService: UserService
  ) {
    
  }

  ngOnInit() {
          this.form = this.fb.group({
      odoMeter: [
       0,
        [Validators.required, Validators.min(this.minOdoMeter)],
      ],
      fuelLevel: ["G1", Validators.required],
    });
   
    this.currentLeg = this.bookingService.currentLeg;

     this.vehicleService.getVehicleVTCBasic(this.currentLeg.mvaNumber).subscribe((result: any) => {
       
        this.vehicleDetails = result.result.getVehicleDataWithVTCOutput;
     
          this.form.patchValue({
            odoMeter: this.vehicleDetails.lastOdo || 0,
            fuelLevel: this.vehicleDetails.fuelLevel || 'G1'
          });
     });

 

    this.route.params.subscribe((params) => {
      const type = this.bookingService.delieveryType;
    });
  }

  checkOdo() {
    const odo = this.form.get('odoMeter')?.value;
    this.minOdoMeter = odo || 0;
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
                .postNoShow(bId, stageNumber, this.bookingService.currentLeg.mvaNumber,user )
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
        this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';

    this.router.navigateByUrl(
      `/vehicle-inspection-replacement/${mva}/${this.currentLeg?.bookingNumber}`
    );
  }

  collectionNavigation(mva: string) {
        this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';

    this.router.navigateByUrl(
      `/customer-accessories/${mva}`
    );
  }

  scanLicense() {
    if (this.form.valid) {
          this.vehicleService.lastOdo = parseInt(this.form.controls['odoMeter'].value ?? '0');
    this.vehicleService.lastFuel = this.form.controls['fuelLevel'].value ?? 'G1';

      this.router.navigateByUrl('/scan-licence');
    }
  }
}

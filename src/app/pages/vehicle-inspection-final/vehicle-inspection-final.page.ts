import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-vehicle-inspection',
  templateUrl: './vehicle-inspection-final.page.html',
  styleUrls: ['./vehicle-inspection-final.page.scss'],
})
export class VehicleInspectionFinalPage implements OnInit {
  form = this.fb.group({
  startStation: ['', Validators.required],
    endStation: ['', Validators.required],
    reasonCode: ['', Validators.required],
    startKms: [0, Validators.required],
    remark: [''],
    endDate: [new Date().toISOString(), Validators.required]  // <-- New field added
  });
  checkOutOdoReading: number = 0;
  stations: any[] = [];
  reasons: any[] = [];
  mva: string = '';
  constructor(
    
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toastController: ToastController,    
    private userService: UserService,
    private router: Router,
     private route: ActivatedRoute,
         private toast: ToastService,
  ) {
    this.route.params.subscribe((params:any) => {
      this.mva = params['mva'];
    });
  }

 ngOnInit() {
  this.loadDropdowns();

  const vtc = this.bookingService._openVTC;

  this.form.controls['startStation'].setValue(vtc?.checkOutStatCode);
  this.form.controls['endStation'].setValue(vtc?.checkInStatCode);
  this.form.controls['reasonCode'].setValue(vtc?.reasonCode.trim());
  this.form.controls['remark'].setValue(vtc?.remark);
  this.checkOutOdoReading = parseInt(vtc?.checkOutOdoReading || '0', 10);
  this.form.controls['startKms'].setValue(this.checkOutOdoReading);
}

  loadDropdowns() {
    this.bookingService.getStations().subscribe((res:any) => {
      this.stations = res;
    });

    this.reasons = this.bookingService.getReasons()
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
  
validateEndKms() {
  const control = this.form.controls['startKms'];
  const value = control.value?? parseInt(this.bookingService._openVTC.checkOutOdoReading);

  if (value < this.checkOutOdoReading) {
    control.setValue(this.checkOutOdoReading);
    this.presentToast('End km cannot be less than starting km');
  }
}
  async submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    let payload = this.form.value as any;
    payload.mva = this.mva;
    payload.employeeNbr = this.userService?.user?.employeeNumber;
    payload.raNumber = "0";
    debugger;
    
    // Replace with actual submission logic
    this.bookingService.submitInspection(payload).subscribe(async () => {
      const toast = await this.toastController.create({
        message: 'Inspection submitted successfully.',
        duration: 1500,
        position: 'bottom',
      });
      await toast.present();

      this.router.navigateByUrl('/manifest-screen');
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
    remark: ['']
  });

  stations: any[] = [];
  reasons: any[] = [];
  mva: string = '';
  constructor(
    
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toastController: ToastController,    
    private userService: UserService,
    private router: Router,
     private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params:any) => {
      this.mva = params['mva'];
    });
  }

  ngOnInit() {
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.bookingService.getStations().subscribe((res:any) => {
      this.stations = res;
    });

    this.reasons = this.bookingService.getReasons()
  }

  async submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let payload = this.form.value as any;
    payload.mva = this.mva;
    payload.employeeNbr = this.userService?.user?.employeeNumber;
 
    
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

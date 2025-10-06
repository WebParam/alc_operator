import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-scan-licence',
  templateUrl: './scan-licence.page.html',
  styleUrls: ['./scan-licence.page.scss'],
})
export class ScanLicencePage implements OnInit {
  public photos: any[] = [];
  public isUploading = false;
  public mva = '';
  currentLeg: any = {};
  public invalidDate = false;
  public additionalDrivers: {
    licenceNumber: string;
    photo?: { filepath: string; webviewPath: string };
  }[] = [];

  form = this.fb.group({
    licenceNumber: ['', [Validators.required]],
    expiryDay: ['', [Validators.required]],
    expiryMonth: ['', [Validators.required]],
    expiryYear: ['', [Validators.required]],
  });

  months = [
    { name: 'January', value: '01', index: 0 },
    { name: 'February', value: '02', index: 1 },
    { name: 'March', value: '03', index: 2 },
    { name: 'April', value: '04', index: 3 },
    { name: 'May', value: '05', index: 4 },
    { name: 'June', value: '06', index: 5 },
    { name: 'July', value: '07', index: 6 },
    { name: 'August', value: '08', index: 7 },
    { name: 'September', value: '09', index: 8 },
    { name: 'October', value: '10', index: 9 },
    { name: 'November', value: '11', index: 10 },
    { name: 'December', value: '12', index: 11 },
  ];

  years: string[] = [];
  days: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private bookingsService: BookingService,
    private toast: ToastService,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        console.log('Booking status:', res.status);
      });
    this.currentLeg = this.bookingsService.currentLeg;
  }

  ngOnInit() {
    this.form.markAllAsTouched();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate years (current year to 20 years in the future)
    for (let i = 0; i < 20; i++) {
      this.years.push((currentYear + i).toString());
    }

    // Generate days (1-31)
    for (let i = 1; i <= 31; i++) {
      this.days.push(i.toString().padStart(2, '0'));
    }

    // Add validator that checks if expiry date is valid
    this.form.valueChanges.subscribe(() => {
      this.validateExpiryDate();
    });
  }


  validateExpiryDate() {
    const expiryDay = this.form.value.expiryDay;
    const expiryMonth = this.form.value.expiryMonth;
    const expiryYear = this.form.value.expiryYear;
    const dayControl = this.form.get('expiryDay');
    const monthControl = this.form.get('expiryMonth');

    // Clear previous errors
    dayControl?.setErrors(null);
    monthControl?.setErrors(null);

    if (!expiryDay || !expiryMonth || !expiryYear) {
      return;
    }

    const currentDate = new Date();
    const expiryDate = new Date(parseInt(expiryYear), parseInt(expiryMonth) - 1, parseInt(expiryDay));
    
    // Check if the date is valid (handles invalid dates like Feb 31)
    if (expiryDate.getDate() !== parseInt(expiryDay) || 
        expiryDate.getMonth() !== parseInt(expiryMonth) - 1 || 
        expiryDate.getFullYear() !== parseInt(expiryYear)) {
      dayControl?.setErrors({ invalidDate: true });
      return;
    }

    // Check if the licence has expired
    if (expiryDate < currentDate) {
      monthControl?.setErrors({ expired: true });
      dayControl?.setErrors({ expired: true });
      this.invalidDate = true;
      this.showInvalidDateAlert()
    }else{
      this.invalidDate = false;
    }
  }


  public async takePhoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      this.photos = [
        {
          filepath: 'soon...',
          webviewPath: capturedPhoto.webPath,
        },
      ];
    } catch (err) {
      this.toast.showToast('Camera error. Please try again.');
    }
  }

  public async takeAdditionalPhoto(index: number) {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      this.additionalDrivers[index].photo = {
        filepath: 'soon...',
        webviewPath: capturedPhoto.webPath ?? '',
      };
    } catch (err) {
      this.toast.showToast('Camera error. Please try again.');
    }
  }

  public addAdditionalDriver() {
    this.additionalDrivers.push({ licenceNumber: '', photo: undefined });
  }

  removeAdditionalDriver(index: number) {
    this.additionalDrivers.splice(index, 1);
  }

  async markAsNoShow() {
    const alert = await this.alertController.create({
      header: 'Confirm no show?',
      subHeader: 'This will confirm the booking as a no show',
      message: 'Confirming no show will mark booking as cancelled',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'OK',
          handler: () => {
            this.route.params.subscribe((params: any) => {
              const bId = params['bookingId'];
              this.bookingsService.postNoShow(bId, '1', this.mva).subscribe(() => {
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

  public isFormComplete(): boolean {
    const licenceNumber = this.form.value.licenceNumber;
    const expiryDay = this.form.value.expiryDay;
    const expiryMonth = this.form.value.expiryMonth;
    const expiryYear = this.form.value.expiryYear;
    
    return !!(licenceNumber && expiryDay && expiryMonth && expiryYear);
  }

  private validateDate(): boolean {
    const expiryDay = this.form.value.expiryDay;
    const expiryMonth = this.form.value.expiryMonth;
    const expiryYear = this.form.value.expiryYear;
    
    if (!expiryDay || !expiryMonth || !expiryYear) {
      return false;
    }

    const expiryDate = new Date(parseInt(expiryYear), parseInt(expiryMonth) - 1, parseInt(expiryDay));
    
    // Check if the date is valid (handles invalid dates like Feb 31)
    return expiryDate.getDate() === parseInt(expiryDay) && 
           expiryDate.getMonth() === parseInt(expiryMonth) - 1 && 
           expiryDate.getFullYear() === parseInt(expiryYear);
  }

  private async showInvalidDateAlert() {
    const alert = await this.alertController.create({
      header: 'Invalid Date',
      message: 'The selected date is not valid. Please check the day, month, and year combination.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ],
      cssClass: 'alertAvis'
    });

    await alert.present();
  }

  private isLicenceExpired(): boolean {
    const expiryDay = this.form.value.expiryDay;
    const expiryMonth = this.form.value.expiryMonth;
    const expiryYear = this.form.value.expiryYear;
    
    if (!expiryDay || !expiryMonth || !expiryYear) {
      return false;
    }

    // Date validation is already handled in validateDate() method
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(expiryYear), parseInt(expiryMonth) - 1, parseInt(expiryDay));
    
    return expiryDate < currentDate;
  }

  private async showExpiredLicenceAlert() {
    const alert = await this.alertController.create({
      header: 'Licence Expired',
      message: 'The driver licence expiry date is in the past. Please update the licence date or mark as no show.',
      buttons: [
        {
          text: 'Update Licence Date',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // User can update the form fields
            return true;
          }
        },
        {
          text: 'Mark as No Show',
          cssClass: 'danger',
          handler: () => {
            this.markAsNoShow();
          }
        }
      ],
      cssClass: 'alertAvis'
    });

    await alert.present();
  }

  public async continue() {
    if (this.photos.length === 0 || !this.isFormComplete()) {
      this.toast.showToast('Please take a photo, enter the licence number, and select expiry day, month and year.');
      return;
    }

    // Validate the date first
    const isValidDate = this.validateDate();
    if (!isValidDate) {
      await this.showInvalidDateAlert();
      return;
    }

    // Check if licence is expired
    if (this.isLicenceExpired()) {
      await this.showExpiredLicenceAlert();
      return;
    }

    
    try {
      this.isUploading = true;

      const payload = new FormData();

      const mainPhoto = this.photos[0];
      const mainPhotoBlob = await fetch(mainPhoto.webviewPath ?? '').then((res) => res.blob());
      payload.append('file', mainPhotoBlob);
      payload.append('licenceNumber', this.form.value.licenceNumber ?? '');
      this.bookingsService._licenceNumber = this.form.value.licenceNumber ?? '';
      const expiryDay = this.form.value.expiryDay;
      const expiryMonth = this.form.value.expiryMonth;
      const expiryYear = this.form.value.expiryYear;
      const formattedDate = `${expiryYear}-${expiryMonth}-${expiryDay}`;
      payload.append('expiryDate', formattedDate);

      for (let i = 0; i < this.additionalDrivers.length; i++) {
        const driver = this.additionalDrivers[i];

        if (!driver.licenceNumber || !driver.photo?.webviewPath) {
          this.toast.showToast(`Driver ${i + 1} info incomplete.`);
          this.isUploading = false;
          return;
        }

        const blob = await fetch(driver.photo.webviewPath).then((res) => res.blob());
        payload.append(`additionalDriverPhotos`, blob, `driver${i + 1}.jpg`);
        payload.append(`additionalDriverNumbers`, driver.licenceNumber);
      }


      this.bookingsService.uploadLicence(payload, this.currentLeg.bookingNumber, this.currentLeg.stageNumber,`${this.form.value.licenceNumber}-${this.form.value.expiryDay}${this.form.value.expiryMonth}${this.form.value.expiryYear}`).subscribe(
        (res: any) => {
          this.isUploading = false;
          const _res = JSON.parse(res);
          if (_res?.createDocOutput?.result?.success === true) {
            this.inspection();
          } else {
            this.toast.showToast('Upload failed. Please try again.');
          }
        },
        () => {
          this.isUploading = false;
          this.toast.showToast('Upload failed. Please check your connection.');
        }
      );
    } catch (err) {
      this.isUploading = false;
      this.toast.showToast('Unexpected error occurred during upload.');
    }
  }

  inspection() {
    const isDel = this.bookingsService.delieveryType == 'BOOKING COLLECTION';
    const mva = this.currentLeg?.mvaNumber;

    if (isDel) {
      this.router.navigateByUrl(`/vehicle-inspection/${mva}/${this.currentLeg?.bookingNumber}`);
    } else {
      this.router.navigateByUrl(`/customer-accessories/${mva}`);
    }
  }

  // Navigation
  manifest() {
    this.router.navigateByUrl('/manifest-screen');
  }
  transfer() {
    this.router.navigateByUrl('/vehicle-transfer');
  }
  lostitem() {
    this.router.navigateByUrl('/forgot-item');
  }
  logoff() {
    this.router.navigateByUrl('/login');
  }
}

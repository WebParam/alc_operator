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
    currentLeg: any = {};
  public isUploading = false;
  public mva = '';

  public additionalDrivers: {
    licenceNumber: string;
    photo?: { filepath: string; webviewPath: string };
  }[] = [];

  form = this.fb.group({
    licenceNumber: ['', [Validators.required]],
    expiryMonth: ['', [Validators.required]],
    expiryYear: ['', [Validators.required]],
  });

  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ];

  years: string[] = [];

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
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 20; i++) {
      this.years.push((currentYear + i).toString());
    }
  }

  public async takePhoto() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      this.photos = [{
        filepath: 'soon...',
        webviewPath: capturedPhoto.webPath,
      }];
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

  public async continue() {
    if (this.photos.length === 0 || this.form.invalid) {
      this.toast.showToast('Please take a photo, enter the licence number, and select expiry month and year.');
      return;
    }

    try {
      this.isUploading = true;

      const payload = new FormData();

      // Main driver photo
      const mainPhoto = this.photos[0];
      const mainPhotoBlob = await fetch(mainPhoto.webviewPath ?? '').then(res => res.blob());
      payload.append('file', mainPhotoBlob);
      payload.append('licenceNumber', this.form.value.licenceNumber ?? '');

      const expiryMonth = this.form.value.expiryMonth;
      const expiryYear = this.form.value.expiryYear;
      const formattedDate = `${expiryYear}-${expiryMonth}`;
      payload.append('expiryDate', formattedDate);

      // Additional drivers
      for (let i = 0; i < this.additionalDrivers.length; i++) {
        const driver = this.additionalDrivers[i];

        if (!driver.licenceNumber || !driver.photo?.webviewPath) {
          this.toast.showToast(`Driver ${i + 1} info incomplete.`);
          this.isUploading = false;
          return;
        }

        const blob = await fetch(driver.photo.webviewPath).then(res => res.blob());
        payload.append(`additionalDriverPhotos`, blob, `driver${i + 1}.jpg`);
        payload.append(`additionalDriverNumbers`, driver.licenceNumber);
      }

      this.bookingsService.uploadLicence(payload, '5379695', '1').subscribe(
        (res: any) => {
          this.isUploading = false;
          const _res = JSON.parse(res);
          if (_res?.createDocOutput?.result?.success === true) {
            this.router.navigateByUrl('/at-delivery-location');
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
    const isDel = this.bookingsService.delieveryType =='BOOKING COLLECTION' ? true : false;
    
    const mva = this.currentLeg?.mvaNumber

    if(isDel) {
      this.router.navigateByUrl(`/vehicle-inspection/${mva}/${this.currentLeg?.bookingNumber}`);

    }else{
      this.router.navigateByUrl(
        `/customer-accessories/${mva}`
      );

    }
  }


  // Navigation
  manifest() { this.router.navigateByUrl('/manifest-screen'); }
  transfer() { this.router.navigateByUrl('/vehicle-transfer'); }
  lostitem() { this.router.navigateByUrl('/forgot-item'); }
  logoff() { this.router.navigateByUrl('/login'); }
  removeAdditionalDriver(index: number) {
  this.additionalDrivers.splice(index, 1);
}
}

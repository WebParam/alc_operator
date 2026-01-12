import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
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
    expiryDay: string;
    expiryMonth: string;
    expiryYear: string;
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
    private alertController: AlertController,
    private userService: UserService
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
    this.additionalDrivers.push({ 
      licenceNumber: '', 
      expiryDay: '',
      expiryMonth: '',
      expiryYear: '',
      photo: undefined 
    });
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
              const user = this.userService?.user?.employeeNumber;
              const bId = parseInt(this.currentLeg.bookingNumber) || params['bookingId'];
              const stageNumber = parseInt(this.currentLeg.stageNumber) || params['stageNumber'];
              this.bookingsService
                .postNoShow(bId, stageNumber, this.bookingsService.currentLeg.mvaNumber, user)
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
      header: 'Expired Licence',
      message: 'The selected licence is expired. Please update the licence date or mark as no show.',
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
      message: 'Scanned main driver license has expired, please contact branch manager',
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

    private async showAdditionalExpiredLicenceAlert(driverIndex: number) {
    const alert = await this.alertController.create({
      header: 'Additional Driver Licence Expired',
      message: `Driver ${driverIndex + 1}'s licence has expired. Please update the licence date or remove this driver.`,
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
          text: 'Remove Additional Driver',
          cssClass: 'danger',
          handler: () => {
            this.removeAdditionalDriver(driverIndex);
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
      // create compressed File from local URL (handles large images)
      const mainPhotoFile = await this.createBlobFromLocalURL(mainPhoto.webviewPath ?? '', 'licence.jpg');
      payload.append('file', mainPhotoFile);
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

        // Check if additional driver form is complete (includes expiry date)
        if (!this.isAdditionalDriverFormComplete(driver)) {
          this.toast.showToast(`Driver ${i + 1} expiry date is required.`);
          this.isUploading = false;
          return;
        }

        // Validate additional driver's license expiry
        if (!this.validateAdditionalDriverDate(driver)) {
          await this.showAdditionalExpiredLicenceAlert(i);
          this.isUploading = false;
          return;
        }

        const driverFile = await this.createBlobFromLocalURL(driver.photo.webviewPath, `driver${i + 1}.jpg`);
        payload.append(`additionalDriverPhotos`, driverFile, `driver${i + 1}.jpg`);
        payload.append(`additionalDriverNumbers`, driver.licenceNumber);
      }


      this.bookingsService
        .uploadLicence(
          payload,
          this.currentLeg.bookingNumber,
          this.currentLeg.stageNumber,
          `${this.form.value.licenceNumber}-${this.form.value.expiryDay}${this.form.value.expiryMonth}${this.form.value.expiryYear}`
        )
        .subscribe(
          (res: any) => {
            this.isUploading = false;

            // Robust parsing: try to JSON.parse repeatedly in case the server double-encodes JSON
            let parsed: any = res;
            try {
              for (let i = 0; i < 3 && typeof parsed === 'string'; i++) {
                try {
                  parsed = JSON.parse(parsed);
                } catch (e) {
                  // If parsing fails, stop trying further
                  console.warn('uploadLicence: JSON.parse attempt failed at depth', i, e);
                  break;
                }
              }
            } catch (e) {
              console.warn('Failed to fully parse uploadLicence response', e, res);
            }

            console.debug('uploadLicence parsed response:', parsed);

            // Accept boolean true, string 'true', numeric 1, or nested result flags
            const nestedSuccess = parsed?.createDocOutput?.result?.success;
            const success =
              nestedSuccess === true ||
              nestedSuccess === 'true' ||
              nestedSuccess === 1 ||
              parsed?.success === true ||
              parsed?.success === 'true' ||
              parsed?.status === 'OK' ||
              parsed === true ||
              parsed === 'true';

            if (success) {
              this.inspection();
              return;
            }

            console.log('ERROR - upload did not indicate success. Parsed:', parsed);
            this.toast.showToast('Upload failed. Please try again.');
          },
          (err: any) => {
            this.isUploading = false;
            console.error('uploadLicence error', err);
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

  // Additional driver validation method
  private validateAdditionalDriverDate(driver: any): boolean {
    if (!driver.expiryDay || !driver.expiryMonth || !driver.expiryYear) {
      return false;
    }

    const currentDate = new Date();
    const expiryDate = new Date(parseInt(driver.expiryYear), parseInt(driver.expiryMonth) - 1, parseInt(driver.expiryDay));
    
    // Check if the date is valid and not expired
    return expiryDate.getDate() === parseInt(driver.expiryDay) && 
           expiryDate.getMonth() === parseInt(driver.expiryMonth) - 1 && 
           expiryDate.getFullYear() === parseInt(driver.expiryYear) &&
           expiryDate >= currentDate;
  }

  private isAdditionalDriverFormComplete(driver: any): boolean {
    return !!(driver.licenceNumber && driver.expiryDay && driver.expiryMonth && driver.expiryYear && driver.photo?.webviewPath);
  }

  async createBlobFromLocalURL(url: string, fileName: string) {
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

      return file; // Return the File
    } catch (error) {
      console.error('Error creating Blob from local URL:', error);
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
}

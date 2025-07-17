import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';

import { VehicleService } from 'src/app/services/vehicle.service';
import { ToastService } from 'src/app/services/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'vehicle-scan-licence',
  templateUrl: './vehicle-scan-licence.page.html',
  styleUrls: ['./vehicle-scan-licence.page.scss'],
})
export class VehicleScanLicencePage implements OnInit {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  scanResult: any;
  proceedText = 'Capture Licence';
  private codeReader = new BrowserMultiFormatReader();
  public photos: any[] = [];
  mvaNumber: string = '';
  hasScanned: boolean = false;
  mvaResults: any[] = [];

  form = this.fb.group({
    licenceNumber: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    private store: Store,
    private bookingsService: BookingService,
        private vehicleService: VehicleService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {
    this.store.select((store: any) => store.bookings).subscribe((res) => {
      console.log(res.status);
    });
  }

  ngOnInit() {
    this.form.markAllAsTouched();
  }

  async continue() {
    this.hasScanned = true;
    await this.doScan();
    this.proceedText = 'Continue';
  }

  public async takePhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.photos.unshift({
      filepath: 'soon...',
      webviewPath: capturedPhoto.webPath,
    });

    const response = await fetch(capturedPhoto.webPath ?? '');
    const fileData = await response.blob();
    const payload = new FormData();
    payload.append('file', fileData);
    payload.append('licenceNumber', this.form.value.licenceNumber ?? '');

    this.bookingsService.uploadLicence(payload, '5379695', '1').subscribe((res: any) => {
      const _res = JSON.parse(res);
      if (_res?.createDocOutput?.result?.success === true) {
        this.router.navigateByUrl('/at-delivery-location?dl=true');
      }
    });
  }

  async manual() {
    if (!this.mvaNumber || this.mvaNumber.length < 5) {
      this.toast.showToast('Please enter a valid MVA number');
      return;
    }

    const payload = new FormData();
    payload.append('mvaNumber', this.mvaNumber);

  this.vehicleService.getVehicleVTC(this.mvaNumber).subscribe({
  next: (data: any) => {
    debugger;
   const _res = JSON.parse(data);
      const output = _res?.mvaOpenVtcOutput?.results ?? [];

      if (output.length > 0) {
        this.mvaResults = output;
      } else {
        this.toast.showToast('No VTC results found for this MVA');
      }
      },
      error: async (error:any) => {
      console.error('Error fetching VTC data:', error);
      this.toast.showToast('Error fetching VTC data');
    }
    
     });
  
    }

  async doScan() {
    try {
      const videoInputDevices = await this.codeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        console.warn('No camera devices found');
        return;
      }

      let selectedDevice = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear')
      );

      if (!selectedDevice) {
        console.warn('Rear camera not found, using default');
        selectedDevice = videoInputDevices[0];
      }

      this.codeReader.decodeFromVideoDevice(
        selectedDevice.deviceId,
        this.video?.nativeElement,
        (result: any, err: any) => {
          if (result) {
            const mva = this.extractMVANumber(result.text);
            this.scanResult = mva;
            this.mvaNumber = mva ?? '';
          }
        }
      );
    } catch (error) {
      console.error('Error during scanning:', error);
    }
  }

  extractMVANumber(barcodeData: string) {
    const parts = barcodeData.split('%').filter(Boolean);
    if (parts.length >= 6) {
      return parts[5];
    }
    return null;
  }

  home() {
    this.router.navigateByUrl('/home-screen');
  }

  manifest() {
    this.router.navigateByUrl('/manifest-screen');
  }

  exchange() {
    this.router.navigateByUrl('/vehicle-exchange');
  }

  transfer() {
    this.router.navigateByUrl('/vehicle-scan-licence');
  }

  lostitem() {
    this.router.navigateByUrl('/forgot-item');
  }

  logoff() {
    this.router.navigateByUrl('/login');
  }
}

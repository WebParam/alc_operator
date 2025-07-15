import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType} from '@zxing/library';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
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
  form = this.fb.group({
    licenceNumber: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    private store: Store,
    private bookingsService: BookingService,
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

  done() {}
  next() {}

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
  
  if (!this.mvaNumber) {
    this.toast.showToast('Please enter an MVA number');
    return;
  }

  const payload = new FormData();
  payload.append('mvaNumber', this.mvaNumber);
  this.router.navigateByUrl('/vehicle-scan-inspection/' + this.mvaNumber + '?vtc=true');
       
}

async doScan() {
  try {
    const videoInputDevices = await this.codeReader.listVideoInputDevices();

    if (videoInputDevices.length === 0) {
      console.warn('No camera devices found');
      return;
    }

    // Prefer a rear camera if available
    
    let selectedDevice = videoInputDevices.find(device =>
      device.label.toLowerCase().includes('back') ||
      device.label.toLowerCase().includes('rear')
    );

    // Fallback to the first device if no rear-facing one is found
    if (!selectedDevice) {
      console.warn('Rear camera not found, using default');
      selectedDevice = videoInputDevices[0];
    }

    this.codeReader.decodeFromVideoDevice(
      selectedDevice.deviceId,
      this.video?.nativeElement,
      (result: any, err: any) => {
        if (result) {
          console.error('Scanned result:', result.text);
          const mva = this.extractMVANumber(result.text);
          this.scanResult = mva;
          this.mvaNumber = mva??"";
          console.error('Scanned MVA:', mva);
          // this.router.navigateByUrl('/vehicle-scan-inspection/' + mva +"?vtc=true");
          // this.codeReader.reset();
        
        }
      }
    );
  } catch (error) {
    console.error('Error during scanning:', error);
  }
}


extractMVANumber(barcodeData:string) {

  const parts = barcodeData.split('%').filter(Boolean); // removes empty strings
  if (parts.length >= 6) {
    return parts[5]; // CAA number is at index 5
  }
  return null;
}




//footer
   home() {
    this.router.navigateByUrl('/home-screen');
  }

  manifest() {
    this.router.navigateByUrl('/manifest-screen');
  }
  exchange() {
    this.router.navigateByUrl('/vehicle-exchange');
  }
  transfer(){
    this.router.navigateByUrl('/vehicle-scan-licence');
  }
  lostitem() {
    this.router.navigateByUrl('/forgot-item');
  }
  logoff() {
    this.router.navigateByUrl('/login');
  }
}

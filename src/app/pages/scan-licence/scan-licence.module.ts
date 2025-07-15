import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanLicencePageRoutingModule } from './scan-licence-routing.module';

import { ScanLicencePage } from './scan-licence.page';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ScanLicencePageRoutingModule,
  ],
  declarations: [ScanLicencePage],
  // providers: [BarcodeScanner],
})
export class ScanLicencePageModule {}

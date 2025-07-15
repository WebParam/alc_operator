import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleScanLicencePageRoutingModule } from './vehicle-scan-licence-routing.module';

import { VehicleScanLicencePage } from './vehicle-scan-licence.page';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VehicleScanLicencePageRoutingModule,
  ],
  declarations: [VehicleScanLicencePage],
  // providers: [BarcodeScanner],
})
export class VehicleScanLicencePageModule {}

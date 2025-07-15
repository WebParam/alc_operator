import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemManifestScreenRoutingModule } from './vehicle-transfer-manifest-routing.module';

import { VehicleTransferManifestScreenPage } from './vehicle-transfer-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotItemManifestScreenRoutingModule
  ],
  declarations: [VehicleTransferManifestScreenPage]
})
export class VehicleTransferManifestScreenModule {}

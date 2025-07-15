import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemManifestScreenRoutingModule } from './vehicle-exchange-manifest-routing.module';

import { VehicleTransferManifestScreenPage } from './vehicle-exchange-manifest.page';

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

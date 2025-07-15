import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemManifestScreenPageRoutingModule } from './forgot-item-manifest-routing.module';

import { ForgotItemManifestScreenPage } from './forgot-item-manifest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotItemManifestScreenPageRoutingModule
  ],
  declarations: [ForgotItemManifestScreenPage]
})
export class ForgotItemManifestScreenPageModule {}

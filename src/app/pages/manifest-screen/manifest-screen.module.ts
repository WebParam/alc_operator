import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManifestScreenPageRoutingModule } from './manifest-screen-routing.module';

import { ManifestScreenPage } from './manifest-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManifestScreenPageRoutingModule
  ],
  declarations: [ManifestScreenPage]
})
export class ManifestScreenPageModule {}

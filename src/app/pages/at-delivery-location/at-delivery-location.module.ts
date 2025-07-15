import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtDeliveryLocationPageRoutingModule } from './at-delivery-location-routing.module';

import { AtDeliveryLocationPage } from './at-delivery-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtDeliveryLocationPageRoutingModule,
      ReactiveFormsModule,
  ],
  declarations: [AtDeliveryLocationPage]
})
export class AtDeliveryLocationPageModule {}

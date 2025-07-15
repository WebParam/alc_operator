import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleExhangeInspectionPageRoutingModule } from './vehicle-exchange-inspection-routing.module';

import { VehicleExhangeInspectionPage } from './vehicle-exchange-inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleExhangeInspectionPageRoutingModule
  ],
  declarations: [VehicleExhangeInspectionPage]
})
export class VehicleExchangeInspectionPageModule {}

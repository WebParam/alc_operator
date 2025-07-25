import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleInspectionPageRoutingModule } from './vehicle-inspection-final-close-routing.module';

import { VehicleInspectionFinalPage } from './vehicle-inspection-final-close.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VehicleInspectionPageRoutingModule,
  ],
  declarations: [VehicleInspectionFinalPage],
})
export class VehicleInspectionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleInspectionPageRoutingModule } from './vehicle-inspection-yard-routing.module';

import { VehicleInspectionPage } from './vehicle-inspection-yard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VehicleInspectionPageRoutingModule,
  ],
  declarations: [VehicleInspectionPage],
})
export class VehicleInspectionPageModule {}

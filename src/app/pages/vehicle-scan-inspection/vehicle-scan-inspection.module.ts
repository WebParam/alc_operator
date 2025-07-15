import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleScanInspectionPageRoutingModule } from './vehicle-scan-inspection-routing.module';

import { VehicleScanInspectionPage } from './vehicle-scan-inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VehicleScanInspectionPageRoutingModule,
  ],
  declarations: [VehicleScanInspectionPage],
})
export class VehicleScanInspectionPageModule {}

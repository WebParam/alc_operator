import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleScanInspectionPage } from './vehicle-scan-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleScanInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleScanInspectionPageRoutingModule {}

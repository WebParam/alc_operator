import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleInspectionFinalPage } from './vehicle-inspection-final-close.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleInspectionFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleInspectionPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleInspectionPage } from './vehicle-inspection-collection.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleInspectionPageRoutingModule {}

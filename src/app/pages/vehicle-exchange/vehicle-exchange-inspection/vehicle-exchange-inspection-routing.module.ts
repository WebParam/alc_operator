import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleExhangeInspectionPage } from './vehicle-exchange-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleExhangeInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleExhangeInspectionPageRoutingModule {}

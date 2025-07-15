import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleScanLicencePage } from './vehicle-scan-licence.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleScanLicencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleScanLicencePageRoutingModule {}

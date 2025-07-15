import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTransferManifestScreenPage } from './vehicle-transfer-manifest.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleTransferManifestScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotItemManifestScreenRoutingModule {}

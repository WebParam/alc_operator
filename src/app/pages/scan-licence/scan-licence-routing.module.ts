import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanLicencePage } from './scan-licence.page';

const routes: Routes = [
  {
    path: '',
    component: ScanLicencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanLicencePageRoutingModule {}

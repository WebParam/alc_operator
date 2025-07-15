import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotItemManifestScreenPage } from './forgot-item-manifest.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotItemManifestScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotItemManifestScreenPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManifestScreenPage } from './manifest-screen.page';

const routes: Routes = [
  {
    path: '',
    component: ManifestScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManifestScreenPageRoutingModule {}

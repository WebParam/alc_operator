import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleAccessoriesPage } from './vehicle-accessories.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleAccessoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleAccessoriesPageRoutingModule {}

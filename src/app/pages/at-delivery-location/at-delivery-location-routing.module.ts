import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtDeliveryLocationPage } from './at-delivery-location.page';

const routes: Routes = [
  {
    path: '',
    component: AtDeliveryLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtDeliveryLocationPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverNavigatorPage } from './driver-navigator.page';

const routes: Routes = [
  {
    path: '',
    component: DriverNavigatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverNavigatorPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotItemCapturePage } from './forgot-item-capture.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotItemCapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotItemCapturePageRoutingModule {}

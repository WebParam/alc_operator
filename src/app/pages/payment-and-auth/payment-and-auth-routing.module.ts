import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentAndAuthPage } from './payment-and-auth.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentAndAuthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentAndAuthPageRoutingModule {}

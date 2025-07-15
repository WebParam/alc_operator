import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentalAgreementPage } from './rental-agreement.page';

const routes: Routes = [
  {
    path: '',
    component: RentalAgreementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalAgreementPageRoutingModule {}

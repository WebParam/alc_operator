import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountLockedPage } from './account-locked.page';

const routes: Routes = [
  {
    path: '',
    component: AccountLockedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountLockedPageRoutingModule {}

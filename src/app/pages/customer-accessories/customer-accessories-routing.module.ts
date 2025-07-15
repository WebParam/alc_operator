import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerAccessoriesPage } from './customer-accessories.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerAccessoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerAccessoriesModuleRoutingModule {}

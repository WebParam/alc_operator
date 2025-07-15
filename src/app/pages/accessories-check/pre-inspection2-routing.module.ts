import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreInspection2Page } from './pre-inspection2.page';

const routes: Routes = [
  {
    path: '',
    component: PreInspection2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreInspection2PageRoutingModule {}

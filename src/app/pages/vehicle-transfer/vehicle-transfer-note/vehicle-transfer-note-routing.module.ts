import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTransferNotePage } from './vehicle-transfer-note.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleTransferNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotItemNotePageRoutingModule {}

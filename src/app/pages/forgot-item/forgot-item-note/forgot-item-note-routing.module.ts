import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotItemNotePage } from './forgot-item-note.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotItemNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotItemNotePageRoutingModule {}

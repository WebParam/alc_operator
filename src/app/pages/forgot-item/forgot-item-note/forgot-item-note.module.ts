import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemNotePageRoutingModule } from './forgot-item-note-routing.module';

import { ForgotItemNotePage } from './forgot-item-note.page';
import { Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotItemNotePageRoutingModule
  ],
  declarations: [ForgotItemNotePage]
})
export class ForgotItemNotePageModule {

  constructor(private router:Router){}
  
  manifest()
  {
    this.router.navigateByUrl('/confirmation');
  }
}

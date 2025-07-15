import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemNotePageRoutingModule } from './vehicle-exchange-note-routing.module';

import { VehicleTransferNotePage } from './vehicle-exchange-note.page';
import { Router } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotItemNotePageRoutingModule
  ],
  declarations: [VehicleTransferNotePage]
})
export class VehicleTransferNotePageModule {

  constructor(private router:Router){}
  
  manifest()
  {
    this.router.navigateByUrl('/confirmation');
  }
}

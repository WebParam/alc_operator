import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotItemCapturePageRoutingModule } from './forgot-item-capture-routing.module';

import { ForgotItemCapturePage } from './forgot-item-capture.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotItemCapturePageRoutingModule
  ],
  declarations: [ForgotItemCapturePage]
})
export class ForgotItemCapturePageModule {
  

  
}

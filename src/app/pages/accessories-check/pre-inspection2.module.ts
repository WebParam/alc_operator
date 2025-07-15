import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreInspection2PageRoutingModule } from './pre-inspection2-routing.module';

import { PreInspection2Page } from './pre-inspection2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreInspection2PageRoutingModule
  ],
  declarations: [PreInspection2Page]
})
export class PreInspection2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreInspectionPageRoutingModule } from './pre-inspection-yard-routing.module';

import { PreInspectionPage } from './pre-inspection-yard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreInspectionPageRoutingModule,
  ],
  declarations: [PreInspectionPage],
})
export class PreInspectionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleAccessoriesPageRoutingModule } from './vehicle-accessories-yard-routing.module';

import { VehicleAccessoriesPage } from './vehicle-accessories-yard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleAccessoriesPageRoutingModule
  ],
  declarations: [VehicleAccessoriesPage]
})
export class VehicleAccessoriesPageModule {}

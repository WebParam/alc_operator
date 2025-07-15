import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerAccessoriesModuleRoutingModule } from './customer-accessories-routing.module';

import { CustomerAccessoriesPage } from './customer-accessories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerAccessoriesModuleRoutingModule
  ],
  declarations: [CustomerAccessoriesPage]
})
export class CustomerAccessoriesModule {}

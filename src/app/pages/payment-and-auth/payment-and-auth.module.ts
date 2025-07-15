import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentAndAuthPageRoutingModule } from './payment-and-auth-routing.module';

import { PaymentAndAuthPage } from './payment-and-auth.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentAndAuthPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [PaymentAndAuthPage]
})
export class PaymentAndAuthPageModule {}

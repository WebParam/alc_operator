import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentalAgreementPageRoutingModule } from './rental-agreement-routing.module';
import { RentalAgreementPage } from './rental-agreement.page';
import { NgxStarRatingModule } from 'ngx-star-rating';
   
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentalAgreementPageRoutingModule,
    NgxStarRatingModule
  ],
  declarations: [RentalAgreementPage],
})
export class RentalAgreementPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountLockedPageRoutingModule } from './account-locked-routing.module';

import { AccountLockedPage } from './account-locked.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountLockedPageRoutingModule
  ],
  declarations: [AccountLockedPage]
})
export class AccountLockedPageModule {}

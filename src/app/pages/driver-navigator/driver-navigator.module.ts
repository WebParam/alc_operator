import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DriverNavigatorPageRoutingModule } from './driver-navigator-routing.module';
import { DriverNavigatorPage } from './driver-navigator.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverNavigatorPageRoutingModule,
  ],
  declarations: [DriverNavigatorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NativeGeocoder],
})
export class DriverNavigatorPageModule {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { IVehicle } from 'src/app/store/bookings.actions';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VehicleDetailsPage implements OnInit {
  selectedAccessories: any[] = [];
  selectedVehicle:any;
  booking: any;
  accessoriesTotal = 0;
  constructor(private store: Store, private router: Router) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => (this.booking = res.selectedBooking));

      this.store
      .select((store: any) => store.bookings.selectedVehicle)
      .subscribe((vehicle) => {
        console.log("vehicles", vehicle)
        this.selectedVehicle = vehicle;
      });
  }
  rowBreak = false;
  ngOnInit() {}
  onConfirmVehicle() {
    const newVehicle = {
      vehicle:this.selectedVehicle,
      leg: this.booking,
      accesories: this.selectedAccessories
    }

    //send to api

    this.router.navigateByUrl("/vehicle-exchange")
  }
  onChangeVehicle() {
    window.history.back();
  }

  addRemoveOption(event: any, extra: any) {
    this.selectedAccessories = this.selectedAccessories.filter(
      (accessory) => accessory.option !== extra.description
    );
    this.selectedAccessories.push({
      option: extra.description,
      cost: extra.price,
      qty: event.detail.value,
      code: extra.code,
    });
    console.log(this.selectedAccessories);
    this.updateAccessoriesTotal();
  }
  updateAccessoriesTotal() {
    this.accessoriesTotal = this.selectedAccessories.reduce(
      (acc, curr) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );
  }
  generateRange(maxAllowed: string): number[] {
    const options = [];
    for (let i = 1; i <= parseInt(maxAllowed); i++) {
      options.push(i);
    }
    return options;
  }
}

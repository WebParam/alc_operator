import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDatabase, onValue, ref, set } from '@angular/fire/database';
import { FirebaseApp } from '@angular/fire/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private fApp: FirebaseApp) {}

  setDriversPosition(lat: number, lng: number, bookingRef: string) {
    const db = getDatabase(this.fApp);
    const dbRef = ref(db, `bookings/${bookingRef}/driver`);
    set(dbRef, { lat, lng });
  }

  getCustomerPosition(bookingRef: string) {
    return new Observable((observer) => {
      const db = getDatabase(this.fApp);
      const dbRef = ref(db, `/bookings/${bookingRef}/customer`);
      onValue(dbRef, (snapshot) => {
        observer.next(snapshot.val());
      });
    });
  }
}

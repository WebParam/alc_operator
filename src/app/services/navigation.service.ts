import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDatabase, onValue, ref, set } from '@angular/fire/database';
import { FirebaseApp } from '@angular/fire/app';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private fApp: FirebaseApp, private http: HttpClient) {}

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

  // Track driver location by pinging API with current GPS position
  trackDriverLocation(userId: string, latitude: number, longitude: number): Observable<any> {
    const trackingData = {
      userId,
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    };
    
    // Use the real API endpoint
    return this.http.post(`${environment.baseUrl}vehicles/trackDriver/${userId}`, {
      latitude,
      longitude
    });
  }

  // Get driver location for a specific booking
  getDriverLocation(userId: string): Observable<any> {
    // Use the real API endpoint
    return this.http.post(`${environment.baseUrl}vehicles/trackDriver/${userId}`, {});
  }
}

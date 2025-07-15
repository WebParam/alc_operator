import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getDatabase, onValue, ref } from '@angular/fire/database';
import { FirebaseApp } from '@angular/fire/app';

import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private fApp: FirebaseApp) {}
  _user?: {
    employeeNumber: string;
    pin: number;
  };

  get user() {
    return this._user ?? JSON.parse(localStorage.getItem('avis-user') ?? '{}');
  }

  // GetOperationUser() {
  //   //TODO add user id here
  //   const userId = 'abc123';
  //   return this.http.get(
  //     // `${this.baseUrl + environment.api.loadBookings}${userId}`
  //     `${this.baseUrl}Booking/operator/123`
  //   );
  // }
  LoginOperationsUser(data: any) {
    return this.http
      .post(`${this.baseUrl + environment.api.operatorLogin}`, data)
      .pipe(
        tap((result) => {
          if (result == 'success') {
            localStorage.setItem('avis-user', JSON.stringify(data));
            this._user = data;
          }
        })
      );
  }
  logOut() {
    this._user = undefined;
    localStorage.clear();
  }

  ResetOperationsUser(data: string) {
    return this.http.post(
      `${this.baseUrl + environment.api.operatorReset}`,
      {staffNumber:data}
    );
  }

 
}

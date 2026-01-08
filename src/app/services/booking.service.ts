import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getDatabase, onValue, ref } from '@angular/fire/database';
import { FirebaseApp } from '@angular/fire/app';

import { Observable, throwError } from 'rxjs';
export interface IAirport {
  active: boolean;
  caT_TYPE: string;
  caT_NUMBER: string;
  notes: string;
  description: string;
  poI_Id: string;
  external_ID: string;
  poI_TYPE: string;
  x: number;
  y: number;
  townBoundName: string;
  suburbName: string;
  townBoundId: string;
  suburbId: string;
  townName: string;
  province: string;
  townId: string;
  countryCode: string;
  shortName: string;
  isDefault: boolean;
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  getTermsAndConditions(bookingNumber: any) {
    return this.http.get(
      `${this.baseUrl}Booking/bookingRentalAgreement/${bookingNumber}`
    );
  }
  endDelivery(bookingId: string, stageNumber: number, mva:string) {
    return this.http.get(
      `${this.baseUrl}Booking/operator/completeDelivery/${bookingId}/${stageNumber}/${mva}`
    );
  }
  
  getStations() {
    return this.http.get(
      `${this.baseUrl}Booking/operator/getStations/`
    );
  }

  getReasons() {
    return [
      {code:"IN", description:"Inter City Transfer (ICT)"}, 
      {code:"RN", description:"Local Transfer"}, 
      {code:"PM", description:"Panel Shop"},
      {code:"SA", description:"Sales Promotion"},
      {code:"OT", description:"Staff use"},
    {code:"DS", description:"Used car yard"}
  ];
  }

  submitInspection(payload: any) {

     return this.http.post(`${this.baseUrl}Booking/operator/createVTC`, payload);

  }

  
  closeInspection(payload: any) {

     return this.http.post(`${this.baseUrl}Booking/operator/closeVTC`, payload);

  }

  

  beginDelivery(bookingId: string, stageNumber: number) {
    return this.http.get(
      `${this.baseUrl}Booking/operator/beginDelivery/${bookingId}/${stageNumber}`
    );
  }

  _openVTC:any;
  _licenceNumber: string = '';
  _currentLeg: any;
  _deliveryType = '';
  set currentLeg(leg: any) {
    this._currentLeg = leg;
    localStorage.setItem('currentLeg', JSON.stringify(leg));
  }
  get currentLeg(): any {
    if (this._currentLeg) {
      return this._currentLeg;
    }
    if (localStorage.getItem('currentLeg')) {
      const retval = JSON.parse(localStorage.getItem('currentLeg') as string);
      this._currentLeg = retval;
      return retval;
    }
  }
  get delieveryType(): string {
    if (this._deliveryType) {
      return this._deliveryType;
    }
    if (localStorage.getItem('deliveryType')) {
      return localStorage.getItem('deliveryType') ?? '';
    }
    return '';
  }
  set delieveryType(type: string) {
    this._deliveryType = type;
    localStorage.setItem('deliveryType', type);
  }
  updateVehicleData(
    value: Partial<{
      odoMeter: string | null;
      fuelLevel: string | null;
      mva: string | null;
      regConfirmed: boolean | null;
      bookingId: string | null;
    }>
  ) {
    value.odoMeter = value.odoMeter?.toString();
    this._currentLeg.latestOdo = value.odoMeter;
    this._currentLeg.latestFuelLevel = value.fuelLevel;
    
    return this.http.post(`${this.baseUrl}vehicles/getUpdateVehicle`, value);
  }
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private fApp: FirebaseApp) {}

  getBookings() {
    //TODO add user id here
    const userId = 'abc123';
    return this.http.get(
      `${this.baseUrl + environment.api.loadBookings}${userId}`
      //`${this.baseUrl}Booking/operator/123`
    );
  }
  getBooking(bookingId:string) {
    //TODO add user id here
    return this.http.get(
      `${this.baseUrl + environment.api.loadBooking}${bookingId}`
      //`${this.baseUrl}Booking/operator/123`
    );
  }

  getRADetails(bookingId:string, stageNumber: string) {
    //TODO add user id here
    return this.http.get(
      `${this.baseUrl + 'Document/RADetails/'}${bookingId}/${stageNumber}`
      //`${this.baseUrl}Booking/operator/123`
    );
  }

  decodeDriversLicense(data: any) {
    return this.http.post(
      `${this.baseUrl + environment.api.driversLicense}`,
      data
    );
  }

  getVehicleRates(payload: any) {
    return this.http.post(this.baseUrl + environment.api.vehicleRates, payload);
  }

  getAvailableAirports() {
    return this.http.get<IAirport[]>(this.baseUrl + environment.api.airports);
  }

  postDamages(body: FormData) {
    return this.http.post(`${this.baseUrl}vehicles/damages/12`, body);

  }

  uploadLicence(body: FormData, bookingId: string, stage: string, licenceNumber?: string) {
    return this.http.post(`${this.baseUrl}saveLicence/${bookingId}/${stage}/${licenceNumber}`, body);

  }

  postForgottenItem(body: FormData, bookingId: string) {
    return this.http.post(`${this.baseUrl}forgottenItem/${bookingId}`, body);

    // .subscribe({
    //   next: (response) => console.log(response),
    //   error: (error) => console.log(error),
    // });
  }

  postUploadCustomerSignature(body: FormData) {
   

    return this.http.post(`${this.baseUrl}vehicles/CompleteCheckin`, body, {
      headers: {
        enctype: 'multipart/form-data',
      },
    });

  }
 postCompleteExchangeCheckin(body: any) {
   

    return this.http.post(`${this.baseUrl}vehicles/CompleteDelivery`, body, {
      headers: {
        enctype: 'multipart/form-data',
      },
    });

  }
  postNoShow(bookingId: string, stage: string, mvaNumber:string, employeeNumber?: string) {
   
    const body ={
      bookingNumber: bookingId,
      stageNumber:stage,
      mvaNumber:mvaNumber,
      employeeNumber: employeeNumber
    };

    return this.http.post(`${this.baseUrl}vehicles/MarkAsNoShow`, body, {
    
    });

  }


  getBookingManifestByEmployee(employeeNumber: any) {
    return this.http.get(
      `${
        this.baseUrl + environment.api.bookings
      }/employee/booking/manifest/employeeNumber/${employeeNumber}`
    );
  }
  getVTC(mva: number) {
    return this.http.get(`${this.baseUrl}vehicles/getUpdateVehicle/${mva}`);
  }

    getVTCFromRegistration(registration: string) {
    return this.http.get(`${this.baseUrl}vehicles/vtc/${registration}?isReg=true`);
  }

  sendCustomerSignature(blob: Blob) {
    const formData = new FormData();
    formData.append('back-left', blob, 'sign.png');
    formData.append(
      'data',
      '{ "mva":"18921394", "stageNumber":"", "bookingId":":"" ,"VehicleAccessories":[],"VehicleQCheck":[]}'
    );

    return this.http.post('https://localhost:7003/Vehicles/damages', formData, {
      headers: {
        enctype: 'multipart/form-data',
      },
    });
  }

  // Track driver location with GPS coordinates
  trackDriverLocation(driverId: string, latitude: number, longitude: number, bookingId?: string, stageNumber?: string) {
    const trackingData = {
      latitude,
      longitude,
      bookingId: bookingId || '',
      stageNumber: stageNumber || ''
    };

    return this.http.post(`${this.baseUrl}vehicles/trackDriver/${driverId}`, trackingData);
  }

  // Get driver location without sending coordinates
  getDriverLocation(driverId: string) {
    return this.http.post(`${this.baseUrl}vehicles/trackDriver/${driverId}`, {});
  }

  // Note: Additional driver tracking endpoints would need to be implemented in the backend:
  // - Driver location history
  // - Driver status management
  // - Active drivers on booking
}

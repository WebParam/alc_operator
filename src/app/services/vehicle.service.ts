import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { getDatabase, onValue, ref } from '@angular/fire/database';
import { FirebaseApp } from '@angular/fire/app';

// import { Observable, throwError } from 'rxjs';
//
@Injectable({
  providedIn: 'root',
})
export class VehicleService {  
  vehicleAccessories: any[] = [];
  vehiclesDamages: any[] = [];
  lastOdo: number = 0;
  lastFuel: string = "G1";
  
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private fApp: FirebaseApp) {}

  async createBlobFromLocalURL(url:string) {
    try {
      // Fetch the data from the local URL
      const response = await fetch(url);
  
      // Ensure the fetch was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
  
      // Convert the response into a Blob
      const blob = await response.blob();
  
      return blob; // Return the Blob
    } catch (error) {
      console.error("Error creating Blob from local URL:", error);
      throw error; // Re-throw error to handle it elsewhere if needed
    }
  }

  updateDamagesAndAccessories(
    mva: string,
    stageNumber: string,
    bookingId: string,
    files:any
  ) {
    console.log(this.vehicleAccessories);
    console.log(this.vehiclesDamages);
    const payload = new FormData();
    
    
    this.createBlobFromLocalURL(files).then((res)=>{
      payload.append("image", res )
    
      const jsonData = {
        mva,
        stageNumber,
        bookingId,
        vehicleAccessories: this.vehicleAccessories,
        VehicleQCheck: this.vehiclesDamages,
      };
     
     
      payload.append('data', JSON.stringify(jsonData));
      payload.append('stageNumber', stageNumber);
      payload.append('bookingId', bookingId);
  
      
      return this.http.post(`${this.baseUrl}Vehicles/damages`, payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    });
 
  }


  
  updateDamages(damange: any, file: Blob) {
    const formData = new FormData();
    formData.append('guid', damange.guid);
    formData.append('damageLocation', damange.damageLocation);
    formData.append('typeOfDamage', damange.typeOfDamage);
    
    const imageFile = new File([file], 'imageName', { type: 'image/jpeg' });
    damange.files.forEach((element: any) => {
      formData.append(damange.guid, imageFile, Blob.name);
    });
    return this.http.post(
      `${this.baseUrl}Vehicles/UpdateVehicleQcheck`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  getDamages() {
    //TODO add user id here
    const vehicleId = 'abc123';
    return this.http.get(
      // `${this.baseUrl + environment.api.loadBookings}${userId}`
      // `https://localhost:7003/Vehicles/damages/123`
      `${this.baseUrl}vehicles/damages/12`
    );
  }

  getVehicleRates(payload: any) {
    return this.http.post(this.baseUrl + environment.api.vehicleRates, payload);
  }
  getVehicleVTC(mva: any) {
    return this.http.get(`${this.baseUrl}vehicles/vtc/${mva}`);
  }

  getVehicleVTCRegistration(mva: any) {
    return this.http.get(`${this.baseUrl}vehicles/vtc/${mva}?isReg=true`);
  }

  getVehicleVTCBasic(mva: any) {
    return this.http.get(`${this.baseUrl}vehicles/vtcbasic/${mva}`);
  }
  
  
  updateVehicleAccessories(payload: any) {
    return this.http.post(
      `${this.baseUrl}vehicles/UpdateVehicleAccessory`,
      payload
    );
  }
}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapsKey: 'AIzaSyA_pMgEY3hnhEpXOjOM7Kgtede5PE-K-7Y',
  validation: {
    live: false, // Set to true to enable image validation across all inspection pages
  },
  firebase: {
    apiKey: 'AIzaSyBXY-NxEGS6y1eDPwr8kJs6qc0hxUiG3YE',
    authDomain: 'avis-customer-app.firebaseapp.com',
    databaseURL:
      'https://avis-customer-app-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'avis-customer-app',
    storageBucket: 'avis-customer-app.appspot.com',
    messagingSenderId: '17023308128',
    appId: '1:17023308128:web:eb6ce5c5a9292d3a03ce05',
  },
  
  // baseUrl:'https://avis-dev-api.azurewebsites.net/',
  baseUrl: 'http://localhost:5170/', 
  api: {
    register: 'User',   
    bookings: 'Booking',
    // getByEmail: 'User/getByEmail',
    login: 'user/operator/login',
    resetPassword: 'User/verify/',
    airports: 'Airport',
    vehicleRates: 'Vehicles',
    loadBookings: 'Booking/customer/',
    loadBooking: 'Booking/',
    otp: 'Customer/otp/',
    driversLicense: 'Document/drivers-license',
    operatorLogin: 'User/operator/login',
    operatorReset: 'User/operator/password-reset',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

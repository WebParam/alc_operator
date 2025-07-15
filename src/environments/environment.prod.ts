export const environment = {
  production: true,
  mapsKey: 'AIzaSyA_pMgEY3hnhEpXOjOM7Kgtede5PE-K-7Y',
  firebase: {
    apiKey: 'AIzaSyCeCe49eW9H81QpRE8YG5s-tjg6Q4MfKOc',
    authDomain: 'avis-project-81bba.firebaseapp.com',
    databaseURL: 'https://avis-project-81bba-default-rtdb.firebaseio.com',
    projectId: 'avis-project-81bba',
    storageBucket: 'avis-project-81bba.appspot.com',
    messagingSenderId: '932067447152',
    appId: '1:932067447152:web:77d29904bf94943c16bfb5',
    measurementId: 'G-Y75FTRPS8C',
  },
//  baseUrl: 'https://localhost:7003/',
  
  baseUrl:'https://avis-dev-api.azurewebsites.net/',

  // baseUrl: 'https://avis-dev.geekymedia.club/',
  api: {
    register: 'User',
    bookings: 'Booking',
    getByEmail: 'User/getByEmail',
    login: 'User/login',
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

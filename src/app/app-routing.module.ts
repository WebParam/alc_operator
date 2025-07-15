import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignaturePadComponent } from './pages/signature-pad/signature-pad.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'driver-navigator',
    loadChildren: () =>
      import('./pages/driver-navigator/driver-navigator.module').then(
        (m) => m.DriverNavigatorPageModule
      ),
  },
  {
    path: 'driver-navigator/:bookingNumber',
    loadChildren: () =>
      import('./pages/driver-navigator/driver-navigator.module').then(
        (m) => m.DriverNavigatorPageModule
      ),
  },
  {
    path: 'vehicle-finder',
    loadComponent: () =>
      import(
        './pages/vehicle-exchange/vehicle-finder/vehicle-finder.page'
      ).then((m) => m.VehicleFinderPage),
  },
  {
    path: 'view-booking',
    loadComponent: () =>
      import('./pages/view-quote-leg/generate-quote.page').then(
        (m) => m.GenerateQuotePage
      ),
  },
  {
    path: 'available-vehicles',
    loadComponent: () =>
      import(
        './pages/vehicle-exchange/available-vehicles/available-vehicles.page'
      ).then((m) => m.AvailableVehiclesPage),
  },
  {
    path: 'vehicle-details',
    loadComponent: () =>
      import(
        './pages/vehicle-exchange/vehicle-details/vehicle-details.page'
      ).then((m) => m.VehicleDetailsPage),
  },
  {
    path: 'booking-summary',
    loadChildren: () =>
      import('./pages/booking-summary/booking-summary.module').then(
        (m) => m.BookingSummaryPageModule
      ),
  },
  {
    path: 'playground',
    loadChildren: () =>
      import('./pages/playground/playground.module').then(
        (m) => m.PlaygroundPageModule
      ),
  },
  {
    path: 'vehicle-exchange-inspection',
    loadChildren: () =>
      import(
        './pages/vehicle-exchange/vehicle-exchange-inspection/vehicle-exchange-inspection.module'
      ).then((m) => m.VehicleExchangeInspectionPageModule),
  },
  {
    path: 'rental-agreement/:id/:mva',
    loadChildren: () =>
      import('./pages/rental-agreement/rental-agreement-routing.module').then(
        (m) => m.RentalAgreementPageRoutingModule
      ),
  },
    {
    path: 'rental-agreement-checkin/:id/:mva',
    loadChildren: () =>
      import(
        './pages/rental-agreement-checkin/rental-agreement.module'
      ).then((m) => m.RentalAgreementPageModule),
  },
  {
    path: 'vehicle-exchange',
    loadChildren: () =>
      import(
        './pages/vehicle-exchange/vehicle-exchange-manifest/vehicle-exchange-manifest.module'
      ).then((m) => m.VehicleTransferManifestScreenModule),
  },
  {
    path: 'vehicle-transfer',
    loadChildren: () =>
      import(
        './pages/vehicle-transfer/vehicle-transfer-manifest/vehicle-transfer-manifest.module'
      ).then((m) => m.VehicleTransferManifestScreenModule),
  },
  {
    path: 'vehicle-transfer-note',
    loadChildren: () =>
      import(
        './pages/vehicle-transfer/vehicle-transfer-note/vehicle-transfer-note.module'
      ).then((m) => m.VehicleTransferNotePageModule),
  },
  {
    path: 'forgot-item',
    loadChildren: () =>
      import(
        './pages/forgot-item/forgot-item-manifest/forgot-item-manifest.module'
      ).then((m) => m.ForgotItemManifestScreenPageModule),
  },
  {
    path: 'forgot-item-capture',
    loadChildren: () =>
      import(
        './pages/forgot-item/forgot-item-capture/forgot-item-capture.module'
      ).then((m) => m.ForgotItemCapturePageModule),
  },
  {
    path: 'forgot-item-note',
    loadChildren: () =>
      import(
        './pages/forgot-item/forgot-item-note/forgot-item-note.module'
      ).then((m) => m.ForgotItemNotePageModule),
  },
  {
    path: 'confirmation',
    loadChildren: () =>
      import('./pages/confirmation/confirmation.module').then(
        (m) => m.ConfirmationPageModule
      ),
  },
  {
    path: 'customer-accessories/:mva',
    loadChildren: () =>
      import('./pages/customer-accessories/customer-accessories.module').then(
        (m) => m.CustomerAccessoriesModule
      ),
  },
  {
    path: 'customer-confirmation',
    loadChildren: () =>
      import('./pages/customer-confirmation/customer-confirmation.module').then(
        (m) => m.ConfirmationPageModule
      ),
  },
  {
    path: 'board',
    loadChildren: () =>
      import('./pages/board/board.module').then((m) => m.BoardPageModule),
  },
  {
    path: 'bottom-menu',
    loadChildren: () =>
      import('./shared/bottom-menu/bottom-menu.module').then(
        (m) => m.BottomMenuPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'manifest-screen',
    loadChildren: () =>
      import('./pages/manifest-screen/manifest-screen.module').then(
        (m) => m.ManifestScreenPageModule
      ),
  },
   {
    path: 'home-screen',
    loadChildren: () =>
      import('./pages/confirmation/confirmation.module').then(
        (m) => m.ConfirmationPageModule
      ),
  },
  {
    path: 'vehicle-inspection/:mva/:bookingId',
    loadChildren: () =>
      import('./pages/vehicle-inspection/vehicle-inspection.module').then(
        (m) => m.VehicleInspectionPageModule
      ),
  },
    {
    path: 'vehicle-inspection-yard/:mva/:bookingId',
    loadChildren: () =>
      import('./pages/vehicle-inspection-yard/vehicle-inspection-yard.module').then(
        (m) => m.VehicleInspectionPageModule
      ),
  }, {
    path: 'vehicle-inspection-collection/:mva/:bookingId',
    loadChildren: () =>
      import('./pages/vehicle-inspection-collection/vehicle-inspection-collection.module').then(
        (m) => m.VehicleInspectionPageModule
      ),
  },
  {
    path: 'vehicle-inspection/:mva/:bookingId/:delivery-type',
    loadChildren: () =>
      import('./pages/vehicle-inspection/vehicle-inspection.module').then(
        (m) => m.VehicleInspectionPageModule
      ),
  },
   {
    path: 'vehicle-inspection-replacement/:mva/:bookingId',
    loadChildren: () =>
      import('./pages/vehicle-inspection-replacement/vehicle-inspection-replacement.module').then(
        (m) => m.VehicleInspectionPageModule
      ),
  },
  {
    path: 'vehicle-scan-inspection/:mva',
    loadChildren: () =>
      import('./pages/vehicle-scan-inspection/vehicle-scan-inspection.module').then(
        (m) => m.VehicleScanInspectionPageModule
      ),
  },
  {
    path: 'pre-inspection/:mva',
    loadChildren: () =>
      import('./pages/pre-inspection/pre-inspection.module').then(
        (m) => m.PreInspectionPageModule
      ),
  },
    {
    path: 'pre-inspection-replacement/:mva',
    loadChildren: () =>
      import('./pages/pre-inspection-replacement/pre-inspection-replacement.module').then(
        (m) => m.PreInspectionPageModule
      ),
  },
      {
    path: 'pre-inspection-yard/:mva',
    loadChildren: () =>
      import('./pages/pre-inspection-yard/pre-inspection-yard.module').then(
        (m) => m.PreInspectionPageModule
      ),
  },
  {
    path: 'pre-inspection/:mva/:delivery-type',
    loadChildren: () =>
      import('./pages/pre-inspection/pre-inspection.module').then(
        (m) => m.PreInspectionPageModule
      ),
  },
  {
    path: 'at-delivery-location',
    loadChildren: () =>
      import('./pages/at-delivery-location/at-delivery-location.module').then(
        (m) => m.AtDeliveryLocationPageModule
      ),
  },
  {
    path: 'customer-inspection/:mva',
    loadChildren: () =>
      import('./pages/customer-inspection/customer-inspection.module').then(
        (m) => m.CustomerInspectionPageModule
      ),
  },
  {
    path: 'capture/:id',
    loadChildren: () =>
      import('./pages/capture/capture.module').then((m) => m.CapturePageModule),
  },
  {
    path: 'customer-capture/:id',
    loadChildren: () =>
      import('./pages/customer-capture/capture.module').then(
        (m) => m.CustomerCapturePageModule
      ),
  },
  {
    path: 'vehicle-accessories/:mva',
    loadChildren: () =>
      import('./pages/vehicle-accessories/vehicle-accessories.module').then(
        (m) => m.VehicleAccessoriesPageModule
      ),
  },
  {
    path: 'vehicle-accessories-replacement/:mva',
    loadChildren: () =>
      import('./pages/vehicle-accessories-replacement/vehicle-accessories-replacement.module').then(
        (m) => m.VehicleAccessoriesPageModule
      ),
  },
  {
    path: 'vehicle-accessories-yard/:mva',
    loadChildren: () =>
      import('./pages/vehicle-accessories-yard/vehicle-accessories-yard.module').then(
        (m) => m.VehicleAccessoriesPageModule
      ),
  },
  {
    path: 'scan-licence',
    loadChildren: () =>
      import('./pages/scan-licence/scan-licence.module').then(
        (m) => m.ScanLicencePageModule
      ),
  },
   {
    path: 'vehicle-scan-licence',
    loadChildren: () =>
      import('./pages/vehicle-scan/vehicle-scan-licence.module').then(
        (m) => m.VehicleScanLicencePageModule
      ),
  },
  {
    path: 'payment-authorisation',
    loadChildren: () =>
      import('./pages/payment-and-auth/payment-and-auth.module').then(
        (m) => m.PaymentAndAuthPageModule
      ),
  },
  {
    path: 'rental-agreement/:id',
    loadChildren: () =>
      import('./pages/rental-agreement/rental-agreement.module').then(
        (m) => m.RentalAgreementPageModule
      ),
  },
  {
    path: 'accessories-check',
    loadChildren: () =>
      import('./pages/accessories-check/pre-inspection2.module').then(
        (m) => m.PreInspection2PageModule
      ),
  },
  {
    path: 'account-locked',
    loadChildren: () =>
      import('./pages/account-locked/account-locked.module').then(
        (m) => m.AccountLockedPageModule
      ),
  },
  {
    path: 'sign',
    component: SignaturePadComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

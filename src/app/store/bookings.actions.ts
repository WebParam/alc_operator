import { createAction, props } from '@ngrx/store';

export const SELECT_BOOKING = 'SELECT_BOOKING';

export const SELECT_LEG = 'SELECT_LEG';

export const SET_MISSING_ACCESSORIES = 'SELECT_MISSING_ACCESSORIES';

export const SET_NEW_DAMAGES = 'SET_NEW_DAMAGES';
export const SET_VEHICLES = 'SET_VEHICLES';
export const SET_SELECTED_VEHICLES = 'SET_SELECTED_VEHICLES';

export const SET_REMOVED_DAMAGES = 'SET_REMOVED_DAMAGES';

export const SET_DAMAGE_IMAGE = 'SET_DAMAGE_IMAGE';

export interface IDocument{
  name?: string,
  fileType?: string,
  document?: string,
  userId?: string,
  wizardNumber?: string,
  bookingId?:string
}
export interface IDocumentUpload extends IDocument{
  _file:Blob
}

export interface IFeeBreakdown {
  priceUnit: string;
  price: string;
  feeType: string;
  calculatedDistance: string;
  calculatedTime: string;
}


export interface IVehicle {
  code: string;
  description: string;
  doors: string;
  maxPassengers: number | null;
  fee: {
    priceUnit: string;
    price: string;
    feeType: string;
    calculatedDistance: string;
    calculatedTime: string;
  };
  isAvailable: boolean | null;
  feeBreakdown: { fee: IFeeBreakdown[] };
  suitCases: number | null;
  fuelType: string | null;
  transmissionType: string | null;
  image?: string | null;
  driverAgeCondition?: string;
  vehicleExtras: _VehicleExtras | null;
}

export interface _VehicleExtras{
  vehicleExtra: IVehicleExtras[]
}
export interface IVehicleExtras {
  name: string;
  fee: string;
}


export interface IDamage{
  id:string,
  damageDescription:string,
  damageLocation:string,
  damageImage:string,
  isNew?:boolean
}
//type 0 = damage, 1 = missing accessory

export const selectBooking = createAction(
  SELECT_BOOKING,
  props<{ booking: any }>()
);


export const selectLeg = createAction(
  SELECT_LEG,
  props<{ leg: any }>()
);


export const setNewDamages = createAction(
  SET_NEW_DAMAGES,
  props<{ newDamages: IDamage[] }>()
);

export const setVehicles = createAction(
  SET_VEHICLES,
  props<{ vehicles: any[] }>()
);

export const setSelectedVehicle = createAction(
  SET_VEHICLES,
  props<{ vehicle: any }>()
);

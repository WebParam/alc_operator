import { createReducer, on } from '@ngrx/store';
// import { IBooking } from 'src/app/interfaces/booking.interface';
import {
  IDamage,
  selectBooking, selectLeg, setNewDamages, setSelectedVehicle, setVehicles
} from './bookings.actions';

export interface BookingsState {
  inProgressBooking: any;
  inProgressLeg:any;
  newDamages:IDamage[]
}

export const initialState: BookingsState = {
  inProgressBooking: {},
  inProgressLeg:{},
  newDamages:[],
 
};

export const bookingsReducer = createReducer(
  initialState,
  on(selectBooking, (state, { booking }) => ({
    ...state,
    inProgressBooking: booking,
  })),
  on(selectLeg, (state, { leg }) => ({
    ...state,
    inProgressLeg: leg,
  })),

  on(setNewDamages, (state, { newDamages }) => ({
    ...state,
    newDamages: newDamages,
  })),
  on(setVehicles, (state, { vehicles }) => ({
    ...state,
    vehicles: vehicles,
  })),
  on(setSelectedVehicle, (state, { vehicle }) => ({
    ...state,
    selectedVehicle: vehicle,
  }))
);

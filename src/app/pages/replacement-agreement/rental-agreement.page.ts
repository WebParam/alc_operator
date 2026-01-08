import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { IDamage } from 'src/app/store/bookings.actions';
import SignaturePad from 'signature_pad';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-rental-agreement',
  templateUrl: './rental-agreement.page.html',
  styleUrls: ['./rental-agreement.page.scss']

})
export class RentalAgreementPage implements OnInit {
  signPad: any;
  booking: any;
  leg: any;
  signatureNeeded!: boolean;
  chauffeurTermsAccepted: boolean = false;
  luxuryTermsAccepted: boolean = false;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  missingAccessories: IDamage[] = [];
  allDamages: IDamage[] = [];
  terms: any = [];
  additionalCharges: boolean = false;
  damageExists: boolean = false;
  bookingId: string = "";
  bookingService: BookingService;
  _vehicleService: VehicleService;
  currentBooking: any;
  customer: any;
  drivers: any[] = [];
  cc: string = "";
  currentDate: Date = new Date();
  apiResponse: any;
  fullvehicles: any;
  equipment: any[] = [];
  mva = "";
  manifestDetails: any;
  rating = 2;
  signaturePad!: SignaturePad;
  replacesmva: string = "";
  bookingDetails: any;
  // @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  raDetails: any;
  signImage: any;
  accessories = [
    { key: 'Baby Seat', price: '450.00' },
    { key: 'GPS', price: '150.00' },
    { key: 'Collection Fee', price: '300.00' },
  ];

  constructor(private store: Store, private _bookingService: BookingService, private router: Router, private route: ActivatedRoute, private vehicleService: VehicleService, private userService: UserService) {

    this.bookingService = _bookingService;
    this._vehicleService = vehicleService;

  }


  init(): void {
    this.route.params.subscribe((params) => {

      const bookingId = params['id'];
      const mva = params['mva'];

      this.bookingId = bookingId;
      this.booking = this.bookingService._currentLeg;

      this.bookingService.getBooking(bookingId).subscribe((res: any) => {
        this.mva = mva;
        this.currentBooking = res.getBookingResult;
        this.leg = res.getBookingResult.legs.leg[0];
        this.customer = res.customer;
        const ccNum = res.customer.creditCardNumber || '';

        if (ccNum.length > 4) {
          const first4 = ccNum.slice(0, 4);
          const masked = `${first4}${'*'.repeat(ccNum.length - 4)}`;
          this.cc = masked;
        } else {
          // If 4 or fewer digits, show only stars
          this.cc = '*'.repeat(ccNum.length);
        }

        this.drivers = res.additionalDrivers;
        this.equipment = res.getBookingResult.legs.leg[0].equipment.equipment;
        this.replacesmva = res.getBookingResult.legs.leg[0].vehicleDetails.results[0].replaceMvaNumber;
      });

      const leg = this.bookingService.currentLeg;
      debugger;
      this._vehicleService.getVehicleVTCBasic(mva).subscribe((result: any) => {

        const accessories = this.vehicleService.vehicleAccessories;

        if (result?.result?.vehicleQcheckOutput?.results) {

          var res = result?.result?.vehicleQcheckOutput.results.map((r: any) => {
            return {
              ...r,
              accessoryFound2: r.accessoryFound == 'Y' ? true : false,
            };
          });

          this.apiResponse = res;
          this.fullvehicles = result.result.getVehicleDataWithVTCOutput;


        }
      });


      this.bookingDetails = this.bookingService.currentLeg;


    });


  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }


  getAccessories(damages: IDamage[]) {
    return (this.missingAccessories = damages.filter(
      (x) =>
        x.damageLocation != 'back' &&
        x.damageLocation != 'front' &&
        x.damageLocation != 'front-left' &&
        x.damageLocation != 'front-right' &&
        x.damageLocation != 'back-right' &&
        x.damageLocation != 'back-left' &&
        x.damageLocation != 'roof' &&
        x.damageLocation != 'front-seat' &&
        x.damageLocation != 'back-seat'
    ));
  }

  ngOnInit() {
    
    this.store
      .select((store: any) => store.bookings.inProgressBooking)
      .subscribe((bookings: any) => {
        this.booking = bookings;
      });

    this.store
      .select((store: any) => store.bookings.inProgressLeg)
      .subscribe((leg: any) => {
        this.leg = leg;
      });

    this.store
      .select((store: any) => store.bookings.newDamages)
      .subscribe((damages: any) => {
        this.allDamages = damages;
        const accessories = this.getAccessories(damages);
        this.missingAccessories = accessories;
      });
      
      this.init();
  }

  // Parse a variety of date formats returned by the backend into a JS Date
  private parseDate(value: any): Date | null {
    if (!value && value !== 0) return null;
    if (value instanceof Date) return value as Date;
    if (typeof value === 'number') return new Date(value);
    if (typeof value === 'string') {
      const s = value.trim();
      // Handle MS JSON date: /Date(1234567890)/
      const msMatch = /\/Date\((\d+)(?:[+-]\d+)?\)\//.exec(s);
      if (msMatch) return new Date(parseInt(msMatch[1], 10));

      // Try ISO / RFC formats
      const iso = new Date(s);
      if (!isNaN(iso.getTime())) return iso;

      // Try dd/MM/yyyy or dd-MM-yyyy
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        const day = parseInt(dmy[1], 10);
        const month = parseInt(dmy[2], 10) - 1;
        const year = parseInt(dmy[3], 10);
        return new Date(year, month, day);
      }
    }
    return null;
  }

  // Return difference in days between two dates (to - from). If invalid, returns empty string.
  public daysBetween(from: any, to: any): string {
    const d1 = this.parseDate(from);
    const d2 = this.parseDate(to);
    if (!d1 || !d2) return '';
    const msPerDay = 24 * 60 * 60 * 1000;
    const diffMs = d2.getTime() - d1.getTime();
    // Use Math.ceil so partial days count as a full rental day
    const days = Math.ceil(Math.abs(diffMs) / msPerDay);
    return days.toString();
  }

  complete() {
        debugger;
    var payload ={
      damageFound: this.damageExists ? 'Y' : 'N',
      mvaNumber: parseInt(this.mva),
      stageNumber: parseInt(this.bookingService._currentLeg.stageNumber),
      bookingNumber: parseInt(this.bookingId),
      additionalCharges: this.additionalCharges ? 'Y' : 'N',
      driverRating: 0
    };

     this.bookingService.postCompleteExchangeCheckin(payload).subscribe(() => {
         this.router.navigateByUrl(`/vehicle-inspection-new-vehicle/${this.bookingService.currentLeg.vehicleDetails?.results[0]?.replacesMva.trim()}/${this.bookingId}`);
     });
  }

}

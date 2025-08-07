import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { IDamage } from 'src/app/store/bookings.actions';
import { NgxStarRatingModule } from 'ngx-star-rating';

@Component({
  selector: 'app-rental-agreement',
  templateUrl: './rental-agreement.page.html',
  styleUrls: ['./rental-agreement.page.scss']

})
export class RentalAgreementPage implements OnInit {
  signPad: any;
  booking: any;
  leg:any;
  signatureNeeded!: boolean;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  missingAccessories: IDamage[] = [];
  allDamages: IDamage[] = [];
  terms: any = [];
  bookingId:string="";
  bookingService:BookingService;
  _vehicleService: VehicleService;
  currentBooking:any;
  customer:any;
  drivers:any[]=[];
  cc:string="";
  apiResponse:any;
  equipment:any[]=[];
  mva="";
  rating = 2;
  replacesmva="";

  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;

  signImage: any;
  accessories = [
    { key: 'Baby Seat', price: '450.00' },
    { key: 'GPS', price: '150.00' },
    { key: 'Collection Fee', price: '300.00' },
  ];

    constructor(private store: Store, private _bookingService: BookingService, private router: Router, private route: ActivatedRoute,    private vehicleService: VehicleService) {
   
    this.bookingService = _bookingService;
    this._vehicleService = vehicleService;

  }

  ionViewDidEnter(): void {
    this.route.params.subscribe((params) => {
      
      const bookingId = params['id'];
      const mva = params['mva'];
    
      this.bookingId = bookingId;
      this.bookingService.getBooking(bookingId).subscribe((res: any) => {
        this.mva = mva;
        this.currentBooking = res.getBookingResult;
        this.leg = res.getBookingResult.legs.leg[0];
        this.customer = res.customer;
        this.cc = `${res.customer.creditCardNumber.slice(4)}`;
        this.drivers = res.additionalDrivers;
        this.equipment = res.getBookingResult.legs.leg[0].equipment.equipment;  
        this.replacesmva = res.getBookingResult.legs.leg[0].vehicleDetails.results[0].replaceMvaNumber;
        
      });
      

   this._vehicleService.getVehicleVTC(mva).subscribe((result: any) => {
        
          const accessories = this.vehicleService.vehicleAccessories;
          
          if (result?.result?.vehicleQcheckOutput?.results) {
           
            var res = result?.result?.vehicleQcheckOutput.results.map((r: any) => {
              return {
                ...r,
                accessoryFound2: r.accessoryFound == 'Y' ? true : false,
              };
            });
            
            this.apiResponse = res;
          }
        });
   

    });

  
  }

  ngAfterViewInit() {
    // this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
    //   backgroundColor: 'rgba(255, 255, 255, 0)',
    //   penColor: 'rgb(255, 255, 255)',
    // });
  }
  /*It's work in devices*/
  startSignPadDrawing(event: Event) {
    console.log(event);
  }
  /*It's work in devices*/
  movedFinger(event: Event) {}
  /*Undo last step from the signature*/
  undoSign() {
    const data = this.signPad.toData();
    if (data) {
      data.pop(); // remove the last step
      this.signPad.fromData(data);
    }
  }
  /*Clean whole the signature*/
  clearSignPad() {
    this.signPad.clear();
  }
  /*Here you can save the signature as a Image*/
  saveSignPad() {
    const base64ImageData = this.signPad.toDataURL();
    // const dataUrl = this.signPad.
    this.signImage = base64ImageData;
    //Here you can save your signature image using your API call.
  }

  b64toBlob = (b64Data: any, contentType: string, sliceSize = 512) => {
    var byteCharacters = atob(b64Data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: contentType });
    return blob;
  };

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
    this.bookingService.getTermsAndConditions(0).subscribe((res: any) => {
      console.log(res);
      this.terms = res.serviceTermsAndConditionsDetailsOutput.results;
    });
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
  }

  complete() {

    var isDel = this.bookingService.currentLeg.vehicleDetails?.results[0]?.allocationType.trim();



    this.sendSignature().subscribe({
      next: (response) => {
        console.log('sig resp', response);
            
        if(isDel == 'BOOKING COLLECTION'){
          this.router.navigateByUrl(
            `/at-delivery-location/`
          );
        }
        
        if(isDel =='EXCHANGE'){
          this.router.navigateByUrl(
            `/pre-inspection/${this.replacesmva}`
          );
        }
        else{
          this.router.navigateByUrl(
            `/manifest-screen`
          );

        }
        
      },
      error: (error) => console.log('sig err', error),
    });

  }

  sendSignature() {
    const compete: FormData = new FormData();


    compete.append("data", JSON.stringify({
      mvaNumber: this.mva,
      bookingNumber:this.bookingId,
      stageNumber: this.currentBooking.stageNumber,
      driverRating: this.rating.toString(),
      damageFound: 0,
      noShow: 0
    }));

    compete.append("", this.signatureImg);


    return this.bookingService.postUploadCustomerSignature(compete);
  }


  sendDamages() {
    const damages: FormData = new FormData();

    const onlyDamages = this.allDamages.filter(
      (x) =>
        x.damageLocation == 'back' ||
        x.damageLocation == 'front' ||
        x.damageLocation == 'front-left' ||
        x.damageLocation == 'front-right' ||
        x.damageLocation == 'back-right' ||
        x.damageLocation == 'back-left' ||
        x.damageLocation == 'roof' ||
        x.damageLocation == 'front-seat' ||
        x.damageLocation == 'back-seat'
    );
    const dataPayload = JSON.stringify(this.allDamages);
    damages.append('data', dataPayload);
    onlyDamages.map((x, i) => {
      if (x.isNew) {
        fetch(x.damageImage).then((r) => {
          r.blob().then((blob) => {
            damages.append(`${x.id}`, blob);
          });
        });
      }
    });
    return this.bookingService.postDamages(damages);
  }

  startDrawing(event: Event) {
    // works in device not in browser
  }
  moved(event: Event) {
    // works in device not in browser
  }
 
}

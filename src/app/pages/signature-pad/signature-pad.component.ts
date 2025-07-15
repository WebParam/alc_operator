import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SignaturePadComponent implements OnInit {
  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  @ViewChild('canvas') canvasEl!: ElementRef;
  signatureImg!: string;
  constructor(private bookingService: BookingService) {}

  ngOnInit() {}
  ionViewDidEnter(): void {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
      backgroundColor: 'rgba(255, 255, 255, 0)',
      penColor: 'rgb(255, 255, 255)',
    });
  }
  startDrawing(event: Event) {
    // works in device not in browser
  }
  moved(event: Event) {
    // works in device not in browser
  }
  async savePad() {
    const base64Data = this.signaturePad.toDataURL();
    const res = await fetch(base64Data);
    const blob = await res.blob();
    console.log(blob);
    this.bookingService
      .sendCustomerSignature(blob)
      .subscribe((result) => console.log(result));
  }
  clearPad() {
    this.signaturePad.clear();
  }
}

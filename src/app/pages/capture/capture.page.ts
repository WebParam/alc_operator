import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Camera, CameraResultType } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { IDamage, setNewDamages } from 'src/app/store/bookings.actions';
@Component({
  selector: 'app-capture',
  templateUrl: './capture.page.html',
  styleUrls: ['./capture.page.scss'],
})
export class CapturePage implements OnInit {
  webUrl: string = '';
  newDamages: IDamage[] = [];
  position: string = '';
  mva = '';
  description = '';
  requireDescription: boolean = false; 

  constructor(
    private router: Router,
    private store: Store,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    //get damages from store
    this.route.params.subscribe((params) => {
      this.mva = params['id'];
    });
  }

  takePicture() {
    const image = Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    }).then((x) => (this.webUrl = x.webPath ?? ''));
  }

  savePicture() {
    
    const damage = {
      id: UUID.UUID(),
      damageDescription:this.description,
      damageLocation: this.position,
      damageImage: this.webUrl,
      isNew: true,
    } as IDamage;

    this.description = '';
    const newDamages = [...this.newDamages, damage] as IDamage[];
    return this.modalCtrl.dismiss(damage, 'confirm');
    // this.store.dispatch(setNewDamages({ newDamages }));
    // this.router.navigateByUrl('/pre-inspection/' + this.mva);
  }

  cancel() {
    this.router.navigateByUrl('/pre-inspection/' + this.mva);
  }
}

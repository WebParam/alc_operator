import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'forgot-item-note',
  templateUrl: './forgot-item-note.page.html',
  styleUrls: ['./forgot-item-note.page.scss'],
})
export class ForgotItemNotePage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  cancel()
  {
    this.router.navigateByUrl('/forgot-item');
  }
  capture()
  {
    this.router.navigateByUrl('/forgot-item-capture');
  }

}

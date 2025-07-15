import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.page.html',
  styleUrls: ['./playground.page.scss'],
})
export class PlaygroundPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  gotTo(url: string) {
    this.router.navigateByUrl(url);
  }
}

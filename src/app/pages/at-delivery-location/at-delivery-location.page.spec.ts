import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtDeliveryLocationPage } from './at-delivery-location.page';

describe('AtDeliveryLocationPage', () => {
  let component: AtDeliveryLocationPage;
  let fixture: ComponentFixture<AtDeliveryLocationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AtDeliveryLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

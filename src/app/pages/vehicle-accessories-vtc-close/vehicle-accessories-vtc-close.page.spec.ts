import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleAccessoriesPage } from './vehicle-accessories-vtc-close.page';

describe('VehicleAccessoriesPage', () => {
  let component: VehicleAccessoriesPage;
  let fixture: ComponentFixture<VehicleAccessoriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleAccessoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

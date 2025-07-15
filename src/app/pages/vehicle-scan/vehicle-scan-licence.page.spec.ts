import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleScanLicencePage } from './vehicle-scan-licence.page';

describe('VehicleScanLicencePage', () => {
  let component: VehicleScanLicencePage;
  let fixture: ComponentFixture<VehicleScanLicencePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleScanLicencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

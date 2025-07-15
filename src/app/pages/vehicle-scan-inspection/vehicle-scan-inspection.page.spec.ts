import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleScanInspectionPage } from './vehicle-scan-inspection.page';

describe('VehicleInspectionPage', () => {
  let component: VehicleScanInspectionPage;
  let fixture: ComponentFixture<VehicleScanInspectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleScanInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

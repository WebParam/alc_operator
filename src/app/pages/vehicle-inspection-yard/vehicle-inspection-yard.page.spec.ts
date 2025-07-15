import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleInspectionPage } from './vehicle-inspection-yard.page';

describe('VehicleInspectionPage', () => {
  let component: VehicleInspectionPage;
  let fixture: ComponentFixture<VehicleInspectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

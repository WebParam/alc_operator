import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleInspectionFinalPage } from './vehicle-inspection-final-close.page';

describe('VehicleInspectionPage', () => {
  let component: VehicleInspectionFinalPage;
  let fixture: ComponentFixture<VehicleInspectionFinalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleInspectionFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

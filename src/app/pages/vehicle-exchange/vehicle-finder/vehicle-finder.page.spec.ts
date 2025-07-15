import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleFinderPage } from './vehicle-finder.page';

describe('VehicleFinderPage', () => {
  let component: VehicleFinderPage;
  let fixture: ComponentFixture<VehicleFinderPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

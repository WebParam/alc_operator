import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvailableVehiclesPage } from './available-vehicles.page';

describe('AvailableVehiclesPage', () => {
  let component: AvailableVehiclesPage;
  let fixture: ComponentFixture<AvailableVehiclesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvailableVehiclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

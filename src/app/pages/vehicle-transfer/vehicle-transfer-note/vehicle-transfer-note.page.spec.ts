import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTransferNotePage } from './vehicle-transfer-note.page';

describe('ConfirmationPage', () => {
  let component: VehicleTransferNotePage;
  let fixture: ComponentFixture<VehicleTransferNotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleTransferNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

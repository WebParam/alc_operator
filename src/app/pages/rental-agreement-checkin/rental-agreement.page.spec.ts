import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalAgreementPage } from './rental-agreement.page';

describe('RentalAgreementPage', () => {
  let component: RentalAgreementPage;
  let fixture: ComponentFixture<RentalAgreementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RentalAgreementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

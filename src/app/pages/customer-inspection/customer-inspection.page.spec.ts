import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerInspectionPage } from './customer-inspection.page';

describe('CustomerInspectionPage', () => {
  let component: CustomerInspectionPage;
  let fixture: ComponentFixture<CustomerInspectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomerInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

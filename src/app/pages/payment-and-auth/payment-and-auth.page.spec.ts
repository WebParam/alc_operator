import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PaymentAndAuthPage } from './payment-and-auth.page';

describe('PaymentAndAuthPage', () => {
  let component: PaymentAndAuthPage;
  let fixture: ComponentFixture<PaymentAndAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentAndAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

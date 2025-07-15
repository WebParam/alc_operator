import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotItemCapturePage } from './forgot-item-capture.page';

describe('CapturePage', () => {
  let component: ForgotItemCapturePage;
  let fixture: ComponentFixture<ForgotItemCapturePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForgotItemCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

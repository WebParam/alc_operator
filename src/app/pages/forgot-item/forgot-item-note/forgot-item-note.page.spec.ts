import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotItemNotePage } from './forgot-item-note.page';

describe('ConfirmationPage', () => {
  let component: ForgotItemNotePage;
  let fixture: ComponentFixture<ForgotItemNotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ForgotItemNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

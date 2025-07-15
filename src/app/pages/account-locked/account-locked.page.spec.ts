import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountLockedPage } from './account-locked.page';

describe('AccountLockedPage', () => {
  let component: AccountLockedPage;
  let fixture: ComponentFixture<AccountLockedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AccountLockedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

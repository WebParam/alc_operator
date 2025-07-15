import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreInspection2Page } from './customer-accessories.page';

describe('PreInspection2Page', () => {
  let component: PreInspection2Page;
  let fixture: ComponentFixture<PreInspection2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PreInspection2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

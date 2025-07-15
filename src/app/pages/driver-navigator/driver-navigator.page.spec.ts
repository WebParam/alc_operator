import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverNavigatorPage } from './driver-navigator.page';

describe('DriverNavigatorPage', () => {
  let component: DriverNavigatorPage;
  let fixture: ComponentFixture<DriverNavigatorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DriverNavigatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

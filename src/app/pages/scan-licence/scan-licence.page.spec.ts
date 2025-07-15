import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanLicencePage } from './scan-licence.page';

describe('ScanLicencePage', () => {
  let component: ScanLicencePage;
  let fixture: ComponentFixture<ScanLicencePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScanLicencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

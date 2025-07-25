import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreInspectionPage } from './pre-inspection-vtc.page';

describe('PreInspectionPage', () => {
  let component: PreInspectionPage;
  let fixture: ComponentFixture<PreInspectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PreInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleTransferManifestScreen } from './vehicle-exchange-manifest.page';

describe('ManifestScreenPage', () => {
  let component: VehicleTransferManifestScreen;
  let fixture: ComponentFixture<VehicleTransferManifestScreen>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleTransferManifestScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

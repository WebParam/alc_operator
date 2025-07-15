import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifestScreenPage } from './manifest-screen.page';

describe('ManifestScreenPage', () => {
  let component: ManifestScreenPage;
  let fixture: ComponentFixture<ManifestScreenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManifestScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

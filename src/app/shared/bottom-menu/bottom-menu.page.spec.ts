import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BottomMenuPage } from './bottom-menu.page';

describe('BottomMenuPage', () => {
  let component: BottomMenuPage;
  let fixture: ComponentFixture<BottomMenuPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BottomMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

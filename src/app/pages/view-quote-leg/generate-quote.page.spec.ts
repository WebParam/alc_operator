import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { GenerateQuotePage } from './generate-quote.page';

describe('GenerateQuotePage', () => {
  let component: GenerateQuotePage;
  let fixture: ComponentFixture<GenerateQuotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GenerateQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesSlider } from './case-studies-slider';

describe('CaseStudiesSlider', () => {
  let component: CaseStudiesSlider;
  let fixture: ComponentFixture<CaseStudiesSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseStudiesSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseStudiesSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

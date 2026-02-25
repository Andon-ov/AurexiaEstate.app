import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsSlider } from './testimonials-slider';

describe('TestimonialsSlider', () => {
  let component: TestimonialsSlider;
  let fixture: ComponentFixture<TestimonialsSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestimonialsSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialsSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

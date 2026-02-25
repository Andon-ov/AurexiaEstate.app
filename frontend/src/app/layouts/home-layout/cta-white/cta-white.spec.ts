import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaWhite } from './cta-white';

describe('CtaWhite', () => {
  let component: CtaWhite;
  let fixture: ComponentFixture<CtaWhite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CtaWhite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtaWhite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsImage } from './about-us-image';

describe('AboutUsImage', () => {
  let component: AboutUsImage;
  let fixture: ComponentFixture<AboutUsImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

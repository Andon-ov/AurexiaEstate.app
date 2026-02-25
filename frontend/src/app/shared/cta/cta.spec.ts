import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cta } from './cta';

describe('Cta', () => {
  let component: Cta;
  let fixture: ComponentFixture<Cta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Cta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

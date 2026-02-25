import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformCard } from './platform-card';

describe('PlatformCard', () => {
  let component: PlatformCard;
  let fixture: ComponentFixture<PlatformCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlatformCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

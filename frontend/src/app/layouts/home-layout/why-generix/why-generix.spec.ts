import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyGenerix } from './why-generix';

describe('WhyGenerix', () => {
  let component: WhyGenerix;
  let fixture: ComponentFixture<WhyGenerix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhyGenerix]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyGenerix);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

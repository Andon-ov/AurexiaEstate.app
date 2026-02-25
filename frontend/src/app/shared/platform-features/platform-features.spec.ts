import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformFeaturesComponent } from './platform-features';
import { TranslationService } from '../../core/services/translation.service';

describe('PlatformFeaturesComponent', () => {
  let component: PlatformFeaturesComponent;
  let fixture: ComponentFixture<PlatformFeaturesComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    mockTranslationService = jasmine.createSpyObj('TranslationService', ['t']);
    
    await TestBed.configureTestingModule({
      declarations: [ PlatformFeaturesComponent ],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of feature cards', () => {
    component.features = [
      {
        title: 'Feature 1',
        description: 'Description 1',
        imageUrl: 'image1.svg'
      },
      {
        title: 'Feature 2',
        description: 'Description 2',
        imageUrl: 'image2.svg'
      }
    ];
    
    fixture.detectChanges();
    
    const featureCards = fixture.nativeElement.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(2);
  });

  it('should display the correct title and subtitle', () => {
    component.title = 'Test Title';
    component.subtitle = 'Test Subtitle';
    
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('.title');
    const subtitleElement = fixture.nativeElement.querySelector('.subtitle');
    
    expect(titleElement.textContent).toContain('Test Title');
    expect(subtitleElement.textContent).toContain('Test Subtitle');
  });
});
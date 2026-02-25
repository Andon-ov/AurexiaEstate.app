// core/models/case-study-slide.model.ts
export interface CaseStudySlide {
  title: string;
  category: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  overlayImage: string;
}

// Old dummy data - kept for fallback
export const CASE_STUDY_SLIDES_OLD: CaseStudySlide[] = [
  {
    title: 'caseStudies.slide1.title',
    category: 'caseStudies.slide1.category',
    buttonText: 'caseStudies.slide1.buttonText',
    buttonLink: '#',
    backgroundImage:
      'https://www.scalefocus.com/wp-content/uploads/2022/07/d82109_6b6ffd5cc10444b99fc0d5f5cb75b7e7_mv2-1.webp',
    overlayImage:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'caseStudies.slide2.title',
    category: 'caseStudies.slide2.category',
    buttonText: 'caseStudies.slide2.buttonText',
    buttonLink: '#',
    backgroundImage: 'https://www.scalefocus.com/wp-content/uploads/2023/10/SCF_main_hero_.webp',
    overlayImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'caseStudies.slide3.title',
    category: 'caseStudies.slide3.category',
    buttonText: 'caseStudies.slide3.buttonText',
    buttonLink: '#',
    backgroundImage:
      'https://www.scalefocus.com/wp-content/uploads/2022/07/d82109_6b6ffd5cc10444b99fc0d5f5cb75b7e7_mv2-1.webp',
    overlayImage:
      'https://images.unsplash.com/photo-1605902711622-cfb43c4437d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
  {
    title: 'caseStudies.slide4.title',
    category: 'caseStudies.slide4.category',
    buttonText: 'caseStudies.slide4.buttonText',
    buttonLink: '#',
    backgroundImage:
      'https://www.scalefocus.com/wp-content/uploads/2022/07/d82109_6b6ffd5cc10444b99fc0d5f5cb75b7e7_mv2-1.webp',
    overlayImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
];

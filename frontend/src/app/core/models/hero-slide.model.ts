// core/models/hero-slide.model.ts
export interface HeroSlide {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

// Deprecated - will be removed after migration to Django CMS
export const HERO_SLIDES_OLD: HeroSlide[] = [
  {
    title: 'Slide 1 Title',
    description: 'Slide 1 Description',
    buttonText: 'Learn More',
    buttonLink: '#',
    backgroundImage: 'https://res.cloudinary.com/dsla98vyk/image/upload/v1757406960/conny-schneider-xuTJZ7uD7PI-unsplash_petnyv.jpg',
  },
  {
    title: 'Slide 2 Title',
    description: 'Slide 2 Description',
    buttonText: 'Get Started',
    buttonLink: '#',
    backgroundImage: 'https://res.cloudinary.com/dsla98vyk/image/upload/v1757406960/codioful-formerly-gradienta-bKESVqfxass-unsplash_quckau.jpg',
  },
  {
    title: 'Slide 3 Title',
    description: 'Slide 3 Description',
    buttonText: 'Contact Us',
    buttonLink: '#',
    backgroundImage: 'https://res.cloudinary.com/dsla98vyk/image/upload/v1757406960/anton-maksimov-5642-su-MSzGw5V0ui8-unsplash_pqlt0q.jpg',
  },
  {
    title: 'Slide 4 Title',
    description: 'Slide 4 Description',
    buttonText: 'Discover',
    buttonLink: '#',
    backgroundImage: 'https://res.cloudinary.com/dsla98vyk/image/upload/v1757406960/visax-6NoEpRc5x2s-unsplash_jgohsu.jpg',
  },
];

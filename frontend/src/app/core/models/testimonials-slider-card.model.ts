// Old interface - deprecated, keeping for backwards compatibility
export interface SliderCard {
  imageUrl: string;
  altText: string;
  description: string;
  name: string;
}

// New interface matching API response
export interface TestimonialCard {
  logoUrl: string;
  name: string;
  description: string;
}

export const SLIDER_CARDS: SliderCard[] = [
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/aviq-logo@2x.png',
    altText: 'John Doe',
    description: 'testimonials.card1.description',
    name: 'testimonials.card1.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/motivforce_logo@2x.png',
    altText: 'Jane Smith',
    description: 'testimonials.card2.description',
    name: 'testimonials.card2.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/aviq-logo@2x.png',
    altText: 'Alice Johnson',
    description: 'testimonials.card3.description',
    name: 'testimonials.card3.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/motivforce_logo@2x.png',
    altText: 'Bob Lee',
    description: 'testimonials.card4.description',
    name: 'testimonials.card4.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/aviq-logo@2x.png',
    altText: 'Maria Ivanova',
    description: 'testimonials.card5.description',
    name: 'testimonials.card5.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/motivforce_logo@2x.png',
    altText: 'Georgi Petrov',
    description: 'testimonials.card6.description',
    name: 'testimonials.card6.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/aviq-logo@2x.png',
    altText: 'Elena Dimitrova',
    description: 'testimonials.card7.description',
    name: 'testimonials.card7.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/motivforce_logo@2x.png',
    altText: 'Ivan Kolev',
    description: 'testimonials.card8.description',
    name: 'testimonials.card8.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/aviq-logo@2x.png',
    altText: 'Tanya Georgieva',
    description: 'testimonials.card9.description',
    name: 'testimonials.card9.name',
  },
  {
    imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/motivforce_logo@2x.png',
    altText: 'Nikolay Stoyanov',
    description: 'testimonials.card10.description',
    name: 'testimonials.card10.name',
  },
];

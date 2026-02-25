// core/models/platform-card.model.ts
export interface PlatformCard {
  title: string;
  imageUrl: string;
  link: string;
  items: string[];
  hoverColor?: string; // Color for background and title on hover
  isPlatform?: boolean; // True = Platform with features page
  heroTitle?: string; // Hero title for platform page (only for platforms)
  subtitle?: string; // Subtitle for platform page (only for platforms)
}

// export const PLATFORM_CARDS: PlatformCard[] = [
//   {
//     title: 'Data & AI',
//     imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/icon_strategy@2x.png',
//     link: 'https://www.scalefocus.com/platforms/data-ai',
//     items: [
//       'Scalefocus Enterprise AI',
//       'Scalefocus Codeflow',
//       'Agentic AI',
//       'Edge AI Implementations',
//       'AI Operations',
//       'Data Engineering',
//       'Advanced Analytics'
//     ]
//   },
//   {
//     title: 'Cloud & DevOps',
//     imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/icon_infrastructure@2x.png',
//     link: 'https://www.scalefocus.com/platforms/cloud-devops',
//     items: [
//       'Cloud Strategy',
//       'DevOps Automation',
//       'Infrastructure as Code',
//       'CI/CD Pipelines',
//       'Monitoring & Logging'
//     ]
//   },
//   {
//     title: 'Digital Experience',
//     imageUrl: 'https://www.scalefocus.com/wp-content/uploads/2022/08/icon_digital@2x.png',
//     link: 'https://www.scalefocus.com/platforms/digital-experience',
//     items: [
//       'UX/UI Design',
//       'Web & Mobile Apps',
//       'Customer Journey Mapping',
//       'Digital Transformation',
//       'Accessibility Optimization'
//     ]
//   }
// ];

// Platform cards are now loaded from database via API
// No hardcoded data needed - all content managed through Django admin

// core/models/partner.model.ts
export interface Partner {
  name: string;
  logoUrl: string;
}

// Deprecated - will be removed after migration to Django CMS
export const PARTNERS_OLD: Partner[] = [
  {
    name: 'Infobip',
    logoUrl: 'https://cdn-web.infobip.com/uploads/2023/01/logo-horiz-black.svg',
  },
  {
    name: 'Auto-Expert',
    logoUrl:
      'https://www.auto-expert.bg/static/media/aei-logo.e1b3c3ed9eb44525cabc480168ff94b6.svg',
  },
  {
    name: 'Revauxy',
    logoUrl: 'https://revauxy.com/en/assets/img/logo_header_black.png',
  },
  {
    name: 'Audatex',
    logoUrl: 'https://www.audatex.bg/cms/image/layout_set_logo?img_id=175549&t=1760701700163',
  },
];

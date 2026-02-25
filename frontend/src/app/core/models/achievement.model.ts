// core/models/achievement.model.ts
export interface Achievement {
  title: string;
  count: string;
}

// Deprecated - will be removed after migration to Django CMS
export const ACHIEVEMENTS_OLD: Achievement[] = [
  { title: 'Completed Projects', count: '10 000+' },
  { title: 'Clients Worldwide', count: '200+' },
  { title: 'Awards', count: '70M+' },
];

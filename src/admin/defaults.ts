import { SectionId, SiteSettings } from '../types';

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'hero',
  'stats',
  'about',
  'journey',
  'ventures',
  'portfolio',
  'philosophy',
  'achievements',
  'media',
  'insights',
  'gallery',
  'contact',
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  accentColor: '#c5a880',
  backgroundColor: '#0d0f12',
  surfaceColor: '#14171f',
  textColor: '#f3f2ee',
  hiddenSections: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  headings: {
    journey: {
      eyebrow: 'CAREER EVOLUTION',
      title: 'Two Decades of Transformation',
      subtitle:
        'From managing live site construction in Mumbai to scaling a top-5 developer in Dubai and establishing a ₹4,500 Cr order book across India.',
    },
    ventures: {
      eyebrow: 'CURRENT VENTURES',
      title: 'Building Across Real Estate & Hospitality',
      subtitle: 'Leading Nyshaa Realty and Sukoon Stays with a focus on premium redevelopment and boutique hospitality.',
    },
    portfolio: {
      eyebrow: 'WORK PORTFOLIO',
      title: 'Landmark Projects & Deliverables',
      subtitle: 'A curated selection of high-value developments across Mumbai, India, and international markets.',
    },
    philosophy: {
      eyebrow: 'LEADERSHIP PHILOSOPHY',
      title: 'The 8 Es of Business',
      subtitle: 'Core principles that guide decision-making, team culture, and long-term value creation.',
    },
    achievements: {
      eyebrow: 'RECOGNITION',
      title: 'Achievements & Honors',
      subtitle: 'Industry awards and executive recognition earned across two decades of leadership.',
    },
    media: {
      eyebrow: 'MEDIA & PRESS',
      title: 'Featured Coverage',
      subtitle: 'Press features, interviews, and published articles highlighting leadership and project milestones.',
    },
    insights: {
      eyebrow: 'INSIGHTS & MEDIA',
      title: 'Social Posts & Videos',
      subtitle: 'Thought leadership, industry commentary, and video features from across platforms.',
    },
    gallery: {
      eyebrow: 'GALLERY',
      title: 'Visual Portfolio',
      subtitle: 'Moments from projects, events, and leadership journeys.',
    },
    csr: {
      eyebrow: 'CSR',
      title: 'Corporate Social Responsibility',
      subtitle: 'Community initiatives, social impact, and giving back.',
    },
  },
};

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Hero',
  stats: 'Stats Strip',
  about: 'About',
  journey: 'Journey',
  ventures: 'Ventures',
  portfolio: 'Projects',
  philosophy: 'Philosophy',
  achievements: 'Achievements',
  media: 'Media & Press',
  insights: 'Social & Videos',
  gallery: 'Gallery',
  contact: 'Contact',
};

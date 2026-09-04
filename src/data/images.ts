import { GalleryItemData } from '../types';

/** Local image paths served from /public/images */
export const images = {
  hero: '/images/hero/nitesh-hero-portrait.png',
  heroBanner: '/images/hero/nitesh-hero-banner.png',
  about: '/images/about/nitesh-portrait.jpeg',

  journey: {
    foundation: '/images/journey/journey-2004-foundation.jpeg',
    uaeTraining: '/images/journey/journey-2005-uae-training.jpeg',
    dubaiScaling: '/images/journey/journey-2006-dubai-scaling.jpeg',
    indiaEmpire: '/images/journey/journey-2011-india-empire.jpeg',
    sukoonStays: '/images/journey/journey-2021-sukoon-stays.jpeg',
    nyshaaPresent: '/images/journey/journey-present-nyshaa.jpeg',
  },

  ventures: {
    nyshaa: '/images/ventures/nyshaa-realty.jpeg',
    sukoon: '/images/ventures/sukoon-stays.jpeg',
  },

  projects: {
    jnpt: '/images/projects/jnpt-sez.jpeg',
    puneMetro: '/images/projects/pune-metro.jpeg',
    gujaratBhavan: '/images/projects/gujarat-bhavan.jpeg',
    leGrandChateau: '/images/projects/le-grand-chateau.jpeg',
    signatureSquare: '/images/projects/signature-square.jpeg',
  },

  awards: {
    cnbc: '/images/awards/award-cnbc-best-property.jpeg',
    youngEntrepreneur: '/images/awards/award-young-entrepreneur.jpeg',
    bestExecutive: '/images/awards/award-best-executive.jpeg',
    indianLeadership: '/images/awards/award-indian-leadership.jpeg',
    tataHousing: '/images/awards/award-tata-housing.jpeg',
    facadeContractor: '/images/awards/award-facade-contractor.jpeg',
  },

  media: {
    navabharat: '/images/media/media-navabharat-conclave.jpeg',
    businessworld: '/images/media/media-bw-businessworld.jpeg',
    tribune: '/images/media/media-tribune-ani.jpeg',
    constructionTech: '/images/media/media-construction-tech.jpeg',
  },

  social: {
    redevelopment: '/images/social/social-redevelopment-insights.jpeg',
    crisisLeadership: '/images/social/social-crisis-leadership.jpeg',
  },

  videos: {
    signatureSquare: '/images/videos/video-signature-square-thumb.jpeg',
    constructionTech: '/images/videos/video-construction-tech-thumb.jpeg',
    naredcoKeynote: '/images/videos/video-naredco-keynote-thumb.jpeg',
  },
} as const;

const galleryMeta: { caption: string; category: string; aspectRatio?: string }[] = [
  { caption: 'Receiving recognition at a national real estate awards ceremony.', category: 'Awards & Recognition', aspectRatio: 'aspect-[4/3]' },
  { caption: 'On-site leadership during an active construction project.', category: 'Site Execution', aspectRatio: 'aspect-[16/9]' },
  { caption: 'Architectural review and façade engineering at a flagship development.', category: 'Architectural Renders', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Award photographs from Estate Awards and industry conclaves.', category: 'Ceremonies', aspectRatio: 'aspect-[3/2]' },
  { caption: 'Keynote address alongside industry leaders and policy makers.', category: 'Keynotes & Industry', aspectRatio: 'aspect-[16/9]' },
  { caption: 'Professional portrait at an executive leadership forum.', category: 'Leadership', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Project milestone celebration with the core delivery team.', category: 'Team & Culture', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Site inspection at a large-scale infrastructure development.', category: 'Site Execution', aspectRatio: 'aspect-[16/9]' },
  { caption: 'Industry conclave featuring urban redevelopment insights.', category: 'Keynotes & Industry', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Formal recognition for construction excellence and delivery.', category: 'Awards & Recognition', aspectRatio: 'aspect-[3/2]' },
  { caption: 'Executive briefing on commercial redevelopment strategy.', category: 'Leadership', aspectRatio: 'aspect-[16/9]' },
  { caption: 'Ground-breaking moment at a premium Mumbai redevelopment site.', category: 'Site Execution', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Panel discussion on sustainable urban infrastructure.', category: 'Keynotes & Industry', aspectRatio: 'aspect-[4/3]' },
  { caption: 'Celebrating project handover with stakeholders and partners.', category: 'Ceremonies', aspectRatio: 'aspect-[3/2]' },
  { caption: 'Behind-the-scenes at a boutique commercial development.', category: 'Architectural Renders', aspectRatio: 'aspect-[16/9]' },
];

export const galleryItems: GalleryItemData[] = galleryMeta.map((item, index) => ({
  id: `gal-${index + 1}`,
  src: `/images/gallery/gallery-${String(index + 1).padStart(2, '0')}.jpeg`,
  caption: item.caption,
  category: item.category,
  aspectRatio: item.aspectRatio,
}));

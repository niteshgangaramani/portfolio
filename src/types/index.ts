export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface CredentialItem {
  degree: string;
  institution: string;
  badge?: string;
}

export interface AboutData {
  sectionHeading: string;
  eyebrow: string;
  quote: string;
  qualifications: CredentialItem[];
  bioParagraphs: string[];
  lifestyleParagraph: string[];
  personalHighlights: { title: string; detail: string; icon: string }[];
  image?: string;
}

export interface JourneyItemData {
  id: string;
  year: string;
  location: string;
  title: string;
  description: string;
  highlights?: string[];
  image?: string;
}

export interface VentureData {
  id: string;
  company: string;
  role: string;
  focus: string;
  vision: string;
  websiteUrl: string;
  logo?: string;
  image?: string;
  tags: string[];
}

export interface ProjectData {
  id: string;
  title: string;
  location: string;
  category: string;
  value: string;
  description: string;
  image?: string;
  highlights?: string[];
  link?: string;
}

export interface PhilosophyItem {
  number: number;
  title: string;
  description: string;
  iconName?: string;
}

export interface AwardData {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
  image?: string;
}

export interface MediaArticleData {
  id: string;
  title: string;
  publication: string;
  date: string;
  description: string;
  url?: string;
  image?: string;
  category?: string;
}

export interface SocialPostData {
  id: string;
  title: string;
  description: string;
  platform: 'LinkedIn' | 'Twitter' | 'Article';
  url: string;
  date?: string;
  tags?: string[];
  image?: string;
}

export interface VideoItemData {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  videoUrl?: string;
  embedId?: string;
  duration?: string;
  thumbnail?: string;
}

export interface GalleryItemData {
  id: string;
  src?: string;
  caption: string;
  category: string;
  aspectRatio?: string;
}

export interface ContactData {
  eyebrow?: string;
  sectionHeading: string;
  subheading: string;
  email: string;
  phone?: string;
  linkedIn: string;
  instagram?: string;
  youtube?: string;
  officeAddress?: string;
  googleMapsUrl?: string;
}

export type SectionId =
  | 'hero'
  | 'stats'
  | 'about'
  | 'journey'
  | 'ventures'
  | 'portfolio'
  | 'philosophy'
  | 'achievements'
  | 'media'
  | 'insights'
  | 'gallery'
  | 'contact';

export interface SectionHeadingOverride {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export interface SiteSettings {
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  hiddenSections: SectionId[];
  sectionOrder: SectionId[];
  headings: Partial<Record<SectionId, SectionHeadingOverride>> & {
    /** CSR tab heading inside the Gallery section (Visual Portfolio | CSR). */
    csr?: SectionHeadingOverride;
  };
}

export interface SiteData {
  settings?: SiteSettings;
  personal: {
    name: string;
    title: string;
    shortTitle: string;
    location: string;
  };
  navigation: NavItem[];
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: { text: string; href: string };
    secondaryCta: { text: string; href: string };
    tertiaryCta: { text: string; href: string };
    image?: string;
  };
  stats: StatItem[];
  about: AboutData;
  journey: JourneyItemData[];
  ventures: VentureData[];
  projects: ProjectData[];
  philosophy: PhilosophyItem[];
  awards: AwardData[];
  media: MediaArticleData[];
  socialPosts: SocialPostData[];
  videos: VideoItemData[];
  gallery: GalleryItemData[];
  /** CSR slideshow — same shape as gallery; edited under Visual Portfolio | CSR tabs. */
  csr: GalleryItemData[];
  contact: ContactData;
}

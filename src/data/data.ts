import { SiteData } from '../types';
import siteDataJson from './site-data.json';

/** Canonical site content — updated by admin Save to disk in dev mode. */
export const siteData: SiteData = siteDataJson as SiteData;

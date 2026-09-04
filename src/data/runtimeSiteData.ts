import { siteData as baseSiteData } from './data';
import { SiteData } from '../types';

export const ADMIN_OVERRIDES_KEY = 'client_portfolio_admin_siteData_v1';

export function getRuntimeSiteData(): SiteData {
  // Frontend-only app; safe to read localStorage in browser.
  const raw = window.localStorage.getItem(ADMIN_OVERRIDES_KEY);
  if (!raw) return baseSiteData;

  try {
    return JSON.parse(raw) as SiteData;
  } catch {
    return baseSiteData;
  }
}


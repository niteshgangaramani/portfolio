import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SectionId, SiteData, SiteSettings } from '../types';
import { siteData as baseSiteData } from '../data/data';
import { ADMIN_OVERRIDES_KEY } from '../data/runtimeSiteData';
import { DEFAULT_SITE_SETTINGS } from './defaults';
import { setByPath } from './fieldUtils';
import { saveSiteDataToDisk } from './adminApi';

const AUTH_KEY = 'client_portfolio_admin_auth';
const EDIT_MODE_KEY = 'client_portfolio_admin_edit_mode';

function mergeSettings(data: SiteData): SiteData {
  return {
    ...data,
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    csr: Array.isArray(data.csr) ? data.csr : [],
    settings: {
      ...DEFAULT_SITE_SETTINGS,
      ...data.settings,
      headings: {
        ...DEFAULT_SITE_SETTINGS.headings,
        ...data.settings?.headings,
      },
      sectionOrder: data.settings?.sectionOrder?.length
        ? data.settings.sectionOrder
        : DEFAULT_SITE_SETTINGS.sectionOrder,
      hiddenSections: data.settings?.hiddenSections ?? [],
    },
  };
}

function loadSiteData(): SiteData {
  const raw = window.localStorage.getItem(ADMIN_OVERRIDES_KEY);
  if (!raw) return mergeSettings(baseSiteData);
  try {
    return mergeSettings(JSON.parse(raw) as SiteData);
  } catch {
    return mergeSettings(baseSiteData);
  }
}

interface AdminContextValue {
  siteData: SiteData;
  settings: SiteSettings;
  isAuthenticated: boolean;
  editMode: boolean;
  selectedPath: string | null;
  panelTab: 'edit' | 'design' | 'sections';
  isDirty: boolean;
  login: (userId: string, password: string) => boolean;
  logout: () => void;
  setEditMode: (on: boolean) => void;
  selectPath: (path: string | null) => void;
  setPanelTab: (tab: 'edit' | 'design' | 'sections') => void;
  updateField: (path: string, value: unknown) => void;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  toggleSectionVisibility: (id: SectionId) => void;
  moveSection: (id: SectionId, direction: 'up' | 'down') => void;
  save: () => Promise<{ ok: boolean; error?: string; mode?: 'disk' | 'localStorage'; writtenAssets?: string[] }>;
  resetToDefaults: () => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<{ ok: boolean; error?: string }>;
  addArrayItem: (arrayPath: string, template: Record<string, unknown>) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => loadSiteData());
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [editMode, setEditModeState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('edit') === '1' || window.sessionStorage.getItem(EDIT_MODE_KEY) === '1';
  });
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<'edit' | 'design' | 'sections'>('edit');
  const [isDirty, setIsDirty] = useState(false);

  const settings = siteData.settings ?? DEFAULT_SITE_SETTINGS;

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty || !editMode) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(siteData));
      } catch {
        /* storage full — user must save to disk with smaller assets */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [siteData, isDirty, editMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--admin-accent', settings.accentColor);
    root.style.setProperty('--admin-bg', settings.backgroundColor);
    root.style.setProperty('--admin-surface', settings.surfaceColor);
    root.style.setProperty('--admin-text', settings.textColor);
    root.style.setProperty('--site-accent', settings.accentColor);
    root.style.setProperty('--site-bg', settings.backgroundColor);
    root.style.setProperty('--site-surface', settings.surfaceColor);
    root.style.setProperty('--site-text', settings.textColor);
  }, [settings.accentColor, settings.backgroundColor, settings.surfaceColor, settings.textColor]);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
    window.sessionStorage.setItem(EDIT_MODE_KEY, on ? '1' : '0');
    if (!on) setSelectedPath(null);
  }, []);

  const login = useCallback((userId: string, password: string) => {
    const ok = userId.trim().toLowerCase() === 'admin' && password.trim() === 'admin';
    if (ok) {
      window.sessionStorage.setItem(AUTH_KEY, '1');
      setIsAuthenticated(true);
      setEditMode(true);
    }
    return ok;
  }, [setEditMode]);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.removeItem(EDIT_MODE_KEY);
    setIsAuthenticated(false);
    setEditModeState(false);
    setSelectedPath(null);
  }, []);

  const updateField = useCallback((path: string, value: unknown) => {
    setSiteData((prev) => setByPath(prev, path, value));
    setIsDirty(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<SiteSettings>) => {
    setSiteData((prev) => ({
      ...prev,
      settings: { ...(prev.settings ?? DEFAULT_SITE_SETTINGS), ...patch },
    }));
    setIsDirty(true);
  }, []);

  const toggleSectionVisibility = useCallback((id: SectionId) => {
    setSiteData((prev) => {
      const s = prev.settings ?? DEFAULT_SITE_SETTINGS;
      const hidden = new Set(s.hiddenSections);
      if (hidden.has(id)) hidden.delete(id);
      else hidden.add(id);
      return { ...prev, settings: { ...s, hiddenSections: [...hidden] } };
    });
    setIsDirty(true);
  }, []);

  const moveSection = useCallback((id: SectionId, direction: 'up' | 'down') => {
    setSiteData((prev) => {
      const s = prev.settings ?? DEFAULT_SITE_SETTINGS;
      const order = [...s.sectionOrder];
      const idx = order.indexOf(id);
      if (idx < 0) return prev;
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= order.length) return prev;
      [order[idx], order[swap]] = [order[swap], order[idx]];
      return { ...prev, settings: { ...s, sectionOrder: order } };
    });
    setIsDirty(true);
  }, []);

  const save = useCallback(async () => {
    const diskResult = await saveSiteDataToDisk(siteData);
    if (diskResult.ok && diskResult.siteData) {
      window.localStorage.removeItem(ADMIN_OVERRIDES_KEY);
      setSiteData(mergeSettings(diskResult.siteData as SiteData));
      setIsDirty(false);
      return {
        ok: true,
        mode: 'disk' as const,
        writtenAssets: diskResult.writtenAssets,
      };
    }

    if (diskResult.error && !diskResult.error.includes('Could not reach')) {
      return { ok: false, error: diskResult.error };
    }

    try {
      window.localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(siteData));
      setIsDirty(false);
      return {
        ok: true,
        mode: 'localStorage' as const,
        error: diskResult.error,
      };
    } catch {
      return { ok: false, error: 'Save failed — storage limit may be exceeded. Try smaller images.' };
    }
  }, [siteData]);

  const resetToDefaults = useCallback(() => {
    if (!window.confirm('Reset all content and design to defaults? This cannot be undone.')) return;
    window.localStorage.removeItem(ADMIN_OVERRIDES_KEY);
    setSiteData(mergeSettings(baseSiteData));
    setIsDirty(false);
    setSelectedPath(null);
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-site-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [siteData]);

  const importJson = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const parsed = mergeSettings(JSON.parse(text) as SiteData);
      setSiteData(parsed);
      setIsDirty(true);
      return { ok: true };
    } catch {
      return { ok: false, error: 'Invalid JSON file.' };
    }
  }, []);

  const addArrayItem = useCallback((arrayPath: string, template: Record<string, unknown>) => {
    setSiteData((prev) => {
      const parts = arrayPath.split('.');
      const clone = structuredClone(prev) as Record<string, unknown>;
      let cur: unknown = clone;
      for (const part of parts) {
        cur = (cur as Record<string, unknown>)[part];
      }
      if (!Array.isArray(cur)) return prev;
      cur.push({ ...template, id: `${arrayPath}-${Date.now()}` });
      return clone as unknown as SiteData;
    });
    setIsDirty(true);
  }, []);

  const removeArrayItem = useCallback((arrayPath: string, index: number) => {
    if (!window.confirm('Remove this item?')) return;
    setSiteData((prev) => {
      const parts = arrayPath.split('.');
      const clone = structuredClone(prev) as Record<string, unknown>;
      let cur: unknown = clone;
      for (const part of parts) {
        cur = (cur as Record<string, unknown>)[part];
      }
      if (!Array.isArray(cur)) return prev;
      cur.splice(index, 1);
      return clone as unknown as SiteData;
    });
    setIsDirty(true);
    setSelectedPath(null);
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      siteData,
      settings,
      isAuthenticated,
      editMode,
      selectedPath,
      panelTab,
      isDirty,
      login,
      logout,
      setEditMode,
      selectPath: setSelectedPath,
      setPanelTab,
      updateField,
      updateSettings,
      toggleSectionVisibility,
      moveSection,
      save,
      resetToDefaults,
      exportJson,
      importJson,
      addArrayItem,
      removeArrayItem,
    }),
    [
      siteData,
      settings,
      isAuthenticated,
      editMode,
      selectedPath,
      panelTab,
      isDirty,
      login,
      logout,
      setEditMode,
      updateField,
      updateSettings,
      toggleSectionVisibility,
      moveSection,
      save,
      resetToDefaults,
      exportJson,
      importJson,
      addArrayItem,
      removeArrayItem,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function useAdminOptional(): AdminContextValue | null {
  return useContext(AdminContext);
}

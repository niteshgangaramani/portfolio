import { siteData as baseSiteData } from '../data/data';

export interface DiskSaveResult {
  ok: boolean;
  error?: string;
  writtenAssets?: string[];
  dataFile?: string;
  siteData?: unknown;
  mode?: 'disk' | 'localStorage';
}

export async function isDiskSaveAvailable(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/health');
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}

async function parseResponse(res: Response): Promise<DiskSaveResult> {
  const text = await res.text();
  if (!text) {
    return { ok: false, error: res.ok ? 'Empty response from save API.' : `Save failed (${res.status})` };
  }
  try {
    return JSON.parse(text) as DiskSaveResult;
  } catch {
    return { ok: false, error: res.ok ? 'Invalid JSON from save API.' : `Save failed (${res.status})` };
  }
}

export async function saveSiteDataToDisk(siteData: unknown): Promise<DiskSaveResult> {
  try {
    const res = await fetch('/api/admin/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteData, baseSiteData }),
    });

    const result = await parseResponse(res);
    if (!res.ok || !result.ok) {
      return { ok: false, error: result.error ?? `Save failed (${res.status})` };
    }

    return { ...result, ok: true, mode: 'disk' };
  } catch {
    return {
      ok: false,
      error: 'Could not reach local save API. Run `npm run dev` to persist changes to project files.',
    };
  }
}

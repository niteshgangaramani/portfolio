import fs from 'node:fs/promises';
import path from 'node:path';

const IMAGE_KEYS = new Set(['image', 'src', 'thumbnail', 'logo']);
const VIDEO_KEYS = new Set(['videoUrl']);

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

export interface PersistResult {
  ok: boolean;
  error?: string;
  writtenAssets?: string[];
  dataFile?: string;
  siteData?: unknown;
}

function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') };
}

function extFromMime(mime: string, fallback: string): string {
  return MIME_EXT[mime] ?? fallback;
}

function isAssetPath(value: unknown): value is string {
  return typeof value === 'string' && (value.startsWith('/images/') || value.startsWith('/videos/'));
}

function isDataUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:');
}

function getByPath(obj: unknown, dotPath: string): unknown {
  const parts = dotPath.split('.');
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    const key = /^\d+$/.test(part) ? Number(part) : part;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function inferAssetPath(fieldPath: string, mime: string, parent: Record<string, unknown> | null): string {
  const ext = extFromMime(mime, mime.startsWith('video/') ? 'mp4' : 'jpeg');
  const id = parent?.id ? slugify(String(parent.id)) : slugify(fieldPath.replace(/\./g, '-'));
  const lastKey = fieldPath.split('.').pop() ?? 'asset';

  if (VIDEO_KEYS.has(lastKey) || mime.startsWith('video/')) {
    return `/videos/${id}.${ext === 'mp4' ? 'mp4' : ext}`;
  }

  if (fieldPath.startsWith('gallery.')) {
    const idx = Number(fieldPath.match(/^gallery\.(\d+)/)?.[1] ?? 0);
    return `/images/gallery/gallery-${String(idx + 1).padStart(2, '0')}.${ext}`;
  }
  if (fieldPath.startsWith('videos.') && lastKey === 'thumbnail') {
    return `/images/videos/${id}-thumb.${ext}`;
  }
  if (fieldPath === 'hero.image') return `/images/hero/hero.${ext}`;
  if (fieldPath === 'about.image') return `/images/about/about.${ext}`;
  if (/^journey\.\d+\.image$/.test(fieldPath)) return `/images/journey/${id}.${ext}`;
  if (/^ventures\.\d+\.(image|logo)$/.test(fieldPath)) {
    return `/images/ventures/${id}${lastKey === 'logo' ? '-logo' : ''}.${ext}`;
  }
  if (/^projects\.\d+\.image$/.test(fieldPath)) return `/images/projects/${id}.${ext}`;
  if (/^awards\.\d+\.image$/.test(fieldPath)) return `/images/awards/${id}.${ext}`;
  if (/^media\.\d+\.image$/.test(fieldPath)) return `/images/media/${id}.${ext}`;
  if (/^socialPosts\.\d+\.image$/.test(fieldPath)) return `/images/social/${id}.${ext}`;

  if (IMAGE_KEYS.has(lastKey)) {
    return `/images/uploads/${id}.${ext}`;
  }

  return `/images/uploads/${id}.${ext}`;
}

async function writeAsset(
  projectRoot: string,
  publicPath: string,
  buffer: Buffer
): Promise<string> {
  const diskPath = path.join(projectRoot, 'public', publicPath);
  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  await fs.writeFile(diskPath, buffer);
  return publicPath;
}

async function persistAssets(
  projectRoot: string,
  value: unknown,
  baseValue: unknown,
  fieldPath: string,
  parent: Record<string, unknown> | null,
  written: string[]
): Promise<unknown> {
  if (Array.isArray(value)) {
    const baseArr = Array.isArray(baseValue) ? baseValue : [];
    const next = [];
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const baseItem = baseArr[i];
      const itemParent = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : null;
      next.push(
        await persistAssets(projectRoot, item, baseItem, `${fieldPath}.${i}`, itemParent, written)
      );
    }
    return next;
  }

  if (value && typeof value === 'object') {
    const baseObj = baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue) ? baseValue : {};
    const obj = value as Record<string, unknown>;
    const baseRecord = baseObj as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(obj)) {
      const childPath = fieldPath ? `${fieldPath}.${key}` : key;
      next[key] = await persistAssets(
        projectRoot,
        child,
        baseRecord[key],
        childPath,
        obj,
        written
      );
    }
    return next;
  }

  if (!isDataUrl(value)) return value;

  const parsed = parseDataUrl(value);
  if (!parsed) return value;

  let targetPath = isAssetPath(baseValue) ? baseValue : inferAssetPath(fieldPath, parsed.mime, parent);

  // Keep gallery filenames stable when extension changes
  if (!isAssetPath(baseValue) && fieldPath.startsWith('gallery.') && fieldPath.endsWith('.src')) {
    targetPath = inferAssetPath(fieldPath, parsed.mime, parent);
  }

  await writeAsset(projectRoot, targetPath, parsed.buffer);
  written.push(targetPath);
  return targetPath;
}

export async function persistSiteDataToDisk(
  projectRoot: string,
  siteData: unknown,
  baseSiteData: unknown
): Promise<PersistResult> {
  try {
    const data = siteData as Record<string, unknown> | null;
    if (!data || typeof data !== 'object' || !data.personal || !Array.isArray(data.navigation)) {
      return { ok: false, error: 'Invalid site data — missing required fields (personal, navigation).' };
    }

    const clone = structuredClone(siteData) as unknown;
    const writtenAssets: string[] = [];
    const resolved = await persistAssets(projectRoot, clone, baseSiteData, '', null, writtenAssets);

    const dataFile = path.join(projectRoot, 'src/data/site-data.json');
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, `${JSON.stringify(resolved, null, 2)}\n`, 'utf8');

    return { ok: true, writtenAssets, dataFile: 'src/data/site-data.json', siteData: resolved };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown persistence error';
    return { ok: false, error: message };
  }
}

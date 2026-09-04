import { SiteData } from '../types';

export function getByPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null) return undefined;
    if (/^\d+$/.test(part)) {
      cur = (cur as unknown[])[Number(part)];
    } else {
      cur = (cur as Record<string, unknown>)[part];
    }
  }
  return cur;
}

export function setByPath<T extends SiteData>(obj: T, path: string, value: unknown): T {
  const parts = path.split('.');
  const clone = structuredClone(obj);
  let cur: Record<string, unknown> | unknown[] = clone as unknown as Record<string, unknown>;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextIndex = /^\d+$/.test(nextPart);

    if (/^\d+$/.test(part)) {
      const idx = Number(part);
      const arr = cur as unknown[];
      if (arr[idx] == null || typeof arr[idx] !== 'object') {
        arr[idx] = isNextIndex ? [] : {};
      }
      cur = arr[idx] as Record<string, unknown> | unknown[];
    } else {
      const record = cur as Record<string, unknown>;
      if (record[part] == null || typeof record[part] !== 'object') {
        record[part] = isNextIndex ? [] : {};
      }
      cur = record[part] as Record<string, unknown> | unknown[];
    }
  }

  const last = parts[parts.length - 1];
  if (/^\d+$/.test(last)) {
    (cur as unknown[])[Number(last)] = value;
  } else {
    (cur as Record<string, unknown>)[last] = value;
  }

  return clone;
}

export function pathLabel(path: string): string {
  return path
    .split('.')
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : p.replace(/([A-Z])/g, ' $1')))
    .join(' › ');
}

export type FieldKind = 'text' | 'textarea' | 'number' | 'image' | 'video' | 'url' | 'tags' | 'lines' | 'platform' | 'icon' | 'aspectRatio';

const ICON_OPTIONS = [
  'ShieldCheck', 'TrendingUp', 'Award', 'Briefcase', 'Users', 'CheckCircle2', 'HardHat', 'Leaf',
  'Activity', 'Trophy', 'Sun', 'Heart', 'Target', 'Eye', 'Compass',
];

const ASPECT_OPTIONS = [
  'aspect-[4/3]', 'aspect-[16/9]', 'aspect-[3/2]', 'aspect-square', 'aspect-video',
];

export { ICON_OPTIONS, ASPECT_OPTIONS };

export function inferFieldKind(path: string, value: unknown): FieldKind {
  const key = path.split('.').pop() ?? '';
  if (key === 'iconName' || key === 'icon') return 'icon';
  if (key === 'aspectRatio') return 'aspectRatio';
  if (key === 'image' || key === 'src' || key === 'thumbnail' || key === 'logo') return 'image';
  if (key === 'videoUrl') return 'video';
  if (key === 'url' || key === 'href' || key === 'websiteUrl' || key === 'youtubeUrl' || key === 'googleMapsUrl' || key === 'linkedIn' || key === 'instagram' || key === 'youtube' || key === 'facebook') return 'url';
  if (key === 'platform') return 'platform';
  if (key === 'tags') return 'tags';
  if (key === 'highlights' || key === 'bioParagraphs' || key === 'lifestyleParagraph') return 'lines';
  if (key === 'number') return 'number';
  if (typeof value === 'string' && value.length > 120) return 'textarea';
  if (typeof value === 'string') return 'text';
  return 'text';
}

/** Image / media keys that must appear in the editor even if missing on the item. */
const ENSURE_FIELDS: Record<string, string[]> = {
  qualifications: ['degree', 'institution', 'badge'],
  journey: ['image'],
  ventures: ['image', 'logo'],
  projects: ['image', 'link'],
  awards: ['image'],
  media: ['image', 'url', 'category'],
  socialPosts: ['image'],
  videos: ['thumbnail', 'videoUrl', 'youtubeUrl'],
  gallery: ['src'],
  csr: ['src'],
};

export function getItemFields(item: Record<string, unknown>, arrayKey?: string): string[] {
  const keys = Object.keys(item).filter((k) => k !== 'id' && typeof item[k] !== 'object');
  const ensure = arrayKey ? ENSURE_FIELDS[arrayKey] : undefined;
  if (!ensure?.length) return keys;
  const set = new Set(keys);
  for (const field of ensure) set.add(field);
  return Array.from(set);
}

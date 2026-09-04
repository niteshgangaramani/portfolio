import React from 'react';
import { useAdmin } from './AdminContext';
import { getByPath, getItemFields, inferFieldKind, pathLabel } from './fieldUtils';
import { Trash2 } from 'lucide-react';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function FieldInput(props: {
  label: string;
  kind: ReturnType<typeof inferFieldKind>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { label, kind, value, onChange } = props;
  const str = value == null ? '' : String(value);

  if (kind === 'image') {
    return (
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)]">{label}</div>
        <div className="flex gap-3 items-start">
          <div className="w-[120px] h-[80px] rounded-sm overflow-hidden bg-[#0e1116] border border-[#232835]">
            {str ? <img src={str} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] p-2 text-[#9fa4b0]">No image</span>}
          </div>
          <div className="flex-1 space-y-2">
            <input type="file" accept="image/*" className="text-xs w-full" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) onChange(await fileToDataUrl(f));
            }} />
            <button type="button" onClick={() => onChange(undefined)} className="text-[11px] px-2 py-1 border border-[#232835] rounded-sm text-[#9fa4b0]">Clear</button>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'video') {
    const isDataUrl = str.startsWith('data:');
    const isLocalPath = str.startsWith('/') && !str.startsWith('//');
    return (
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)]">{label}</div>
        {(isDataUrl || isLocalPath || str.includes('.mp4')) && (
          <div className="rounded-sm overflow-hidden bg-[#0e1116] border border-[#232835] aspect-video max-h-[140px]">
            <video src={str} className="w-full h-full object-contain" controls muted playsInline />
          </div>
        )}
        <div className="space-y-2">
          <label className="block">
            <div className="text-[10px] text-[#9fa4b0] font-mono mb-1">Upload video file (.mp4)</div>
            <input
              type="file"
              accept="video/mp4,video/*"
              className="text-xs w-full"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) onChange(await fileToDataUrl(f));
              }}
            />
          </label>
          <label className="block">
            <div className="text-[10px] text-[#9fa4b0] font-mono mb-1">Or paste URL / path</div>
            <input
              value={str}
              placeholder="/videos/my-video.mp4"
              onChange={(e) => onChange(e.target.value || undefined)}
              className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70"
            />
          </label>
          <button type="button" onClick={() => onChange(undefined)} className="text-[11px] px-2 py-1 border border-[#232835] rounded-sm text-[#9fa4b0]">Clear</button>
        </div>
      </div>
    );
  }

  if (kind === 'textarea' || kind === 'lines') {
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <textarea
          value={kind === 'lines' && Array.isArray(value) ? (value as string[]).join('\n') : str}
          rows={4}
          onChange={(e) =>
            onChange(kind === 'lines' ? e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) : e.target.value)
          }
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70"
        />
      </label>
    );
  }

  if (kind === 'tags') {
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <input
          value={Array.isArray(value) ? (value as string[]).join(', ') : str}
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70"
        />
      </label>
    );
  }

  if (kind === 'platform') {
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <select
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee]"
        >
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter">Twitter</option>
          <option value="Article">Article</option>
        </select>
      </label>
    );
  }

  if (kind === 'icon') {
    const icons = ['ShieldCheck', 'TrendingUp', 'Award', 'Briefcase', 'Users', 'CheckCircle2', 'HardHat', 'Leaf', 'Activity', 'Trophy', 'Sun', 'Heart', 'Target', 'Eye', 'Compass'];
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <select
          value={str || icons[0]}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee]"
        >
          {icons.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
      </label>
    );
  }

  if (kind === 'aspectRatio') {
    const aspects = ['aspect-[4/3]', 'aspect-[16/9]', 'aspect-[3/2]', 'aspect-square', 'aspect-video'];
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <select
          value={str || aspects[0]}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee]"
        >
          {aspects.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>
    );
  }

  if (kind === 'url') {
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <input
          value={str}
          placeholder="https://..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70 font-mono"
        />
      </label>
    );
  }

  if (kind === 'number') {
    return (
      <label className="block">
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
        <input
          type="number"
          value={Number(value) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-1">{label}</div>
      <input
        value={str}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#101218] border border-[#232835] rounded-sm px-3 py-2 text-xs text-[#f3f2ee] outline-none focus:border-[var(--admin-accent,#c5a880)]/70"
      />
    </label>
  );
}

export const EditPanel: React.FC = () => {
  const admin = useAdmin();
  const { siteData, selectedPath, updateField, removeArrayItem } = admin;

  if (!selectedPath) {
    return (
      <div className="p-5 text-center text-[#9fa4b0] text-xs font-mono space-y-3">
        <p>Click any highlighted element on the page to edit it here.</p>
        <p className="text-[10px] leading-relaxed text-[#7a8190]">
          Double-click text for quick inline edits · Click images for upload · Use Sections tab to add/reorder content · Save writes to project files when dev server is running
        </p>
      </div>
    );
  }

  const value = getByPath(siteData, selectedPath);
  const parts = selectedPath.split('.');
  const last = parts[parts.length - 1];
  const isArrayIndex = /^\d+$/.test(last);
  const arrayPath = isArrayIndex ? parts.slice(0, -1).join('.') : null;
  const arrayKey = arrayPath?.split('.').pop();

  // Whole object item (journey.0)
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const item = value as Record<string, unknown>;
    let fields = getItemFields(item, arrayKey);
    if (arrayKey === 'videos' || arrayPath?.startsWith('videos')) {
      const order = ['thumbnail', 'videoUrl', 'youtubeUrl', 'title', 'description', 'duration', 'embedId'];
      fields = [...fields].sort((a, b) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    } else if (arrayKey && ['journey', 'ventures', 'projects', 'awards', 'media', 'socialPosts', 'gallery', 'csr'].includes(arrayKey)) {
      const imageFirst = ['image', 'src', 'logo', 'thumbnail'];
      fields = [...fields].sort((a, b) => {
        const ai = imageFirst.includes(a) ? 0 : 1;
        const bi = imageFirst.includes(b) ? 0 : 1;
        return ai - bi;
      });
    }
    const showHighlights = Array.isArray(item.highlights) || arrayKey === 'journey' || arrayKey === 'projects';
    const showTags = Array.isArray(item.tags) || arrayKey === 'ventures' || arrayKey === 'socialPosts';
    return (
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono text-[#9fa4b0]">Editing item</div>
            <div className="text-sm font-semibold text-[#f3f2ee]">{pathLabel(selectedPath)}</div>
          </div>
          {arrayPath && (
            <button
              type="button"
              onClick={() => removeArrayItem(arrayPath, Number(last))}
              className="p-2 rounded-sm border border-red-900/50 text-red-400 hover:bg-red-950/30"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {fields.map((fieldName) => {
          const fieldPath = `${selectedPath}.${fieldName}`;
          const fieldValue = item[fieldName];
          return (
            <div key={fieldName}>
              <FieldInput
                label={fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                kind={inferFieldKind(fieldPath, fieldValue)}
                value={fieldValue}
                onChange={(v) => updateField(fieldPath, v)}
              />
            </div>
          );
        })}
        {showHighlights && (
          <FieldInput
            label="Highlights (one per line)"
            kind="lines"
            value={Array.isArray(item.highlights) ? item.highlights : []}
            onChange={(v) => updateField(`${selectedPath}.highlights`, v)}
          />
        )}
        {showTags && (
          <FieldInput
            label="Tags"
            kind="tags"
            value={Array.isArray(item.tags) ? item.tags : []}
            onChange={(v) => updateField(`${selectedPath}.tags`, v)}
          />
        )}
      </div>
    );
  }

  // Single scalar field
  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div>
        <div className="text-[10px] font-mono text-[#9fa4b0]">Editing field</div>
        <div className="text-sm font-semibold text-[#f3f2ee]">{pathLabel(selectedPath)}</div>
      </div>
      <FieldInput
        label={last.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
        kind={inferFieldKind(selectedPath, value)}
        value={value}
        onChange={(v) => updateField(selectedPath, v)}
      />
    </div>
  );
};
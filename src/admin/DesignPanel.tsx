import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { SECTION_LABELS } from './defaults';
import { SectionId } from '../types';
import { getByPath } from './fieldUtils';
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

const ADD_TEMPLATES: { key: string; label: string; template: Record<string, unknown> }[] = [
  { key: 'stats', label: 'Stat', template: { id: 'stat', value: '0', label: 'Label', description: 'Description' } },
  { key: 'navigation', label: 'Nav link', template: { label: 'New Link', href: '#section' } },
  { key: 'philosophy', label: 'Philosophy pillar', template: { number: 1, title: 'Title', description: 'Description', iconName: 'ShieldCheck' } },
  { key: 'journey', label: 'Journey item', template: { id: 'journey', year: '2024', location: 'City', title: 'Title', description: 'Description', highlights: [], image: '' } },
  { key: 'ventures', label: 'Venture', template: { id: 'venture', company: 'Company', role: 'Role', focus: 'Focus', vision: 'Vision', websiteUrl: '#', tags: [], image: '', logo: '' } },
  { key: 'projects', label: 'Project', template: { id: 'project', title: 'Project', location: 'City', category: 'Category', value: '₹0 Cr', description: 'Description', highlights: [], image: '', link: '' } },
  { key: 'awards', label: 'Award', template: { id: 'award', title: 'Award', organization: 'Org', year: '2024', description: 'Description', image: '' } },
  { key: 'media', label: 'Media article', template: { id: 'media', title: 'Title', publication: 'Publication', date: '2024', description: 'Description', category: 'Press', url: '', image: '' } },
  { key: 'socialPosts', label: 'Social post', template: { id: 'social', title: 'Title', description: 'Description', platform: 'LinkedIn', url: '#', tags: [], image: '' } },
  { key: 'videos', label: 'Video', template: { id: 'video', title: 'Title', description: 'Description', videoUrl: '', youtubeUrl: '', duration: '0:00', thumbnail: '' } },
  { key: 'gallery', label: 'Gallery image', template: { id: 'gallery', caption: 'Caption', category: 'General', aspectRatio: 'aspect-[4/3]', src: '' } },
  { key: 'csr', label: 'CSR image', template: { id: 'csr', caption: 'CSR caption', category: 'CSR', aspectRatio: 'aspect-[4/3]', src: '' } },
  {
    key: 'about.qualifications',
    label: 'Credential',
    template: { degree: 'New Degree / Certification', institution: 'Institution', badge: 'Category' },
  },
];

function itemLabel(item: Record<string, unknown>, fallbackIndex: number): string {
  const candidates = [item.title, item.degree, item.company, item.caption, item.label, item.publication, item.year];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return `Item ${fallbackIndex + 1}`;
}

export const DesignPanel: React.FC = () => {
  const { settings, updateSettings } = useAdmin();

  return (
    <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div>
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-3">Brand Colors</div>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ['accentColor', 'Accent / Gold'],
              ['backgroundColor', 'Page Background'],
              ['surfaceColor', 'Card Surface'],
              ['textColor', 'Primary Text'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <div className="text-[10px] text-[#9fa4b0] mb-1">{label}</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings[key]}
                  onChange={(e) => updateSettings({ [key]: e.target.value })}
                  className="w-8 h-8 rounded-sm border border-[#232835] cursor-pointer bg-transparent"
                />
                <input
                  value={settings[key]}
                  onChange={(e) => updateSettings({ [key]: e.target.value })}
                  className="flex-1 bg-[#101218] border border-[#232835] rounded-sm px-2 py-1 text-[10px] font-mono text-[#f3f2ee]"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-sm border border-[#232835] bg-[#101218] text-[10px] text-[#9fa4b0] font-mono leading-relaxed">
        Color changes apply live across the page. Save to persist.
      </div>
    </div>
  );
};

export const SectionsPanel: React.FC = () => {
  const {
    settings,
    siteData,
    toggleSectionVisibility,
    moveSection,
    updateSettings,
    addArrayItem,
    removeArrayItem,
    selectPath,
    setPanelTab,
  } = useAdmin();
  const [manageKey, setManageKey] = useState<string | null>(null);

  const updateHeading = (
    sectionId: SectionId | 'csr',
    field: 'eyebrow' | 'title' | 'subtitle',
    value: string
  ) => {
    updateSettings({
      headings: {
        ...settings.headings,
        [sectionId]: {
          ...settings.headings[sectionId],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div>
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-2">Add Content</div>
        <div className="grid grid-cols-2 gap-2">
          {ADD_TEMPLATES.map(({ key, label, template }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                addArrayItem(key, template);
                setManageKey(key);
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-dashed border-[#232835] text-[10px] text-[#9fa4b0] hover:border-[var(--admin-accent,#c5a880)]/40"
            >
              <Plus className="w-3 h-3 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)] mb-2">Manage / Delete Items</div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {ADD_TEMPLATES.map(({ key, label }) => {
            const items = getByPath(siteData, key);
            const count = Array.isArray(items) ? items.length : 0;
            const active = manageKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setManageKey(active ? null : key)}
                className={`px-2 py-1 rounded-sm border text-[10px] font-mono ${
                  active
                    ? 'border-[var(--admin-accent,#c5a880)] text-[var(--admin-accent,#c5a880)] bg-[var(--admin-accent,#c5a880)]/10'
                    : 'border-[#232835] text-[#9fa4b0] hover:border-[#3a4254]'
                }`}
              >
                {label}s ({count})
              </button>
            );
          })}
        </div>

        {manageKey && (() => {
          const items = getByPath(siteData, manageKey);
          if (!Array.isArray(items) || items.length === 0) {
            return (
              <div className="p-3 rounded-sm border border-[#232835] bg-[#101218] text-[10px] text-[#7a8190] font-mono">
                No items yet. Use Add Content above.
              </div>
            );
          }
          return (
            <div className="rounded-sm border border-[#232835] bg-[#101218] divide-y divide-[#1a1e28] max-h-56 overflow-y-auto">
              {items.map((raw, index) => {
                const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
                const label = itemLabel(item, index);
                return (
                  <div key={String(item.id ?? index)} className="flex items-center gap-2 px-2.5 py-2">
                    <button
                      type="button"
                      title="Edit item"
                      onClick={() => {
                        selectPath(`${manageKey}.${index}`);
                        setPanelTab('edit');
                      }}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="text-[11px] text-[#f3f2ee] truncate">{label}</div>
                      <div className="text-[9px] font-mono text-[#7a8190]">#{index + 1}</div>
                    </button>
                    <button
                      type="button"
                      title="Delete item"
                      onClick={() => removeArrayItem(manageKey, index)}
                      className="p-1.5 rounded-sm border border-red-900/50 text-red-400 hover:bg-red-950/40 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      <div className="text-[11px] font-mono text-[var(--admin-accent,#c5a880)]">Section Order & Visibility</div>
      {settings.sectionOrder.map((id, idx) => {
        const hidden = settings.hiddenSections.includes(id);
        const heading = settings.headings[id];
        return (
          <div key={id} className={`p-3 rounded-sm border ${hidden ? 'border-[#232835] opacity-60' : 'border-[#2a3040]'} bg-[#101218] space-y-2`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#f3f2ee]">{SECTION_LABELS[id]}</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={idx === 0} onClick={() => moveSection(id, 'up')} className="p-1 rounded-sm border border-[#232835] disabled:opacity-30 text-[#9fa4b0]">
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" disabled={idx === settings.sectionOrder.length - 1} onClick={() => moveSection(id, 'down')} className="p-1 rounded-sm border border-[#232835] disabled:opacity-30 text-[#9fa4b0]">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => toggleSectionVisibility(id)} className="p-1 rounded-sm border border-[#232835] text-[#9fa4b0]">
                  {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {heading && (
              <div className="space-y-2 pt-2 border-t border-[#232835]">
                <div className="text-[9px] font-mono text-[#7a8190] uppercase tracking-wider">
                  {id === 'gallery' ? 'Visual Portfolio headings' : 'Headings'}
                </div>
                <input
                  placeholder="Eyebrow"
                  value={heading.eyebrow ?? ''}
                  onChange={(e) => updateHeading(id, 'eyebrow', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
                <input
                  placeholder="Title"
                  value={heading.title ?? ''}
                  onChange={(e) => updateHeading(id, 'title', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
                <textarea
                  placeholder="Subtitle"
                  value={heading.subtitle ?? ''}
                  rows={2}
                  onChange={(e) => updateHeading(id, 'subtitle', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
              </div>
            )}
            {id === 'gallery' && (
              <div className="space-y-2 pt-2 border-t border-[#232835]">
                <div className="text-[9px] font-mono text-[#7a8190] uppercase tracking-wider">CSR tab headings</div>
                <input
                  placeholder="Eyebrow"
                  value={settings.headings.csr?.eyebrow ?? ''}
                  onChange={(e) => updateHeading('csr', 'eyebrow', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
                <input
                  placeholder="Title"
                  value={settings.headings.csr?.title ?? ''}
                  onChange={(e) => updateHeading('csr', 'title', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
                <textarea
                  placeholder="Subtitle"
                  value={settings.headings.csr?.subtitle ?? ''}
                  rows={2}
                  onChange={(e) => updateHeading('csr', 'subtitle', e.target.value)}
                  className="w-full bg-[#0d0f12] border border-[#232835] rounded-sm px-2 py-1 text-[10px] text-[#f3f2ee]"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

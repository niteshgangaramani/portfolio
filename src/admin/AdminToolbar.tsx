import React, { useRef, useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { isDiskSaveAvailable } from './adminApi';
import {
  Save,
  LogOut,
  Palette,
  LayoutGrid,
  Pencil,
  Eye,
  Download,
  Upload,
  RotateCcw,
  X,
  ChevronRight,
} from 'lucide-react';
import { EditPanel } from './EditPanel';
import { DesignPanel, SectionsPanel } from './DesignPanel';

export const AdminToolbar: React.FC = () => {
  const admin = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [diskSaveReady, setDiskSaveReady] = useState<boolean | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  useEffect(() => {
    isDiskSaveAvailable().then(setDiskSaveReady);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await admin.save();
      if (result.ok && result.mode === 'disk') {
        const count = result.writtenAssets?.length ?? 0;
        setSaveMsg(count > 0 ? `Saved to project (${count} file${count === 1 ? '' : 's'})` : 'Saved to project files');
        setDiskSaveReady(true);
      } else if (result.ok && result.mode === 'localStorage') {
        setSaveMsg('Saved to browser only — run npm run dev to write project files');
      } else {
        setSaveMsg(result.error ?? 'Save failed');
      }
      setTimeout(() => setSaveMsg(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  if (!admin.isAuthenticated || !admin.editMode) return null;

  return (
    <>
      {/* Top toolbar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#0d0f12]/95 backdrop-blur-md border-b border-[var(--admin-accent,#c5a880)]/30 shadow-2xl" data-admin-ui>
        <div className="max-w-[100vw] px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] text-[10px] font-mono font-bold uppercase shrink-0">
              <Pencil className="w-3 h-3" />
              Visual Editor
            </span>
            {admin.isDirty && (
              <span className="text-[10px] font-mono text-amber-400/90 shrink-0">Unsaved changes</span>
            )}
            {diskSaveReady === true && (
              <span className="hidden md:inline text-[10px] font-mono text-emerald-400/80 shrink-0">Disk save on</span>
            )}
            {diskSaveReady === false && (
              <span className="hidden md:inline text-[10px] font-mono text-amber-400/70 shrink-0">Browser-only save</span>
            )}
            {saveMsg && (
              <span className={`text-[10px] font-mono shrink-0 max-w-[40vw] truncate ${saveMsg.includes('failed') || saveMsg.includes('browser only') ? 'text-amber-400' : 'text-emerald-400'}`}>
                {saveMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => { admin.setPanelTab('edit'); setPanelOpen(true); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[10px] font-semibold shrink-0 ${admin.panelTab === 'edit' ? 'bg-[var(--admin-accent,#c5a880)] text-[#0d0f12]' : 'border border-[#232835] text-[#9fa4b0]'}`}
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              type="button"
              onClick={() => { admin.setPanelTab('design'); setPanelOpen(true); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[10px] font-semibold shrink-0 ${admin.panelTab === 'design' ? 'bg-[var(--admin-accent,#c5a880)] text-[#0d0f12]' : 'border border-[#232835] text-[#9fa4b0]'}`}
            >
              <Palette className="w-3 h-3" /> Design
            </button>
            <button
              type="button"
              onClick={() => { admin.setPanelTab('sections'); setPanelOpen(true); }}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-sm text-[10px] font-semibold shrink-0 ${admin.panelTab === 'sections' ? 'bg-[var(--admin-accent,#c5a880)] text-[#0d0f12]' : 'border border-[#232835] text-[#9fa4b0]'}`}
            >
              <LayoutGrid className="w-3 h-3" /> Sections
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-2 py-1.5 rounded-sm bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white text-[10px] font-semibold shrink-0">
              <Save className="w-3 h-3" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={admin.exportJson} className="p-1.5 rounded-sm border border-[#232835] text-[#9fa4b0] shrink-0" title="Export JSON">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-sm border border-[#232835] text-[#9fa4b0] shrink-0" title="Import JSON">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={admin.resetToDefaults} className="p-1.5 rounded-sm border border-[#232835] text-[#9fa4b0] shrink-0" title="Reset">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => admin.setEditMode(false)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-[#232835] text-[#9fa4b0] text-[10px] font-semibold shrink-0"
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
            <button type="button" onClick={admin.logout} className="p-1.5 rounded-sm border border-[#232835] text-[#9fa4b0] shrink-0" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (f) {
              const r = await admin.importJson(f);
              if (!r.ok) alert(r.error);
            }
          }}
        />
      </div>

      {/* Side panel */}
      {panelOpen ? (
        <div className="fixed top-[42px] right-0 bottom-0 w-full sm:w-[360px] z-[9998] bg-[#14171f] border-l border-[#232835] shadow-2xl flex flex-col" data-admin-ui>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#232835]">
            <span className="text-xs font-mono text-[var(--admin-accent,#c5a880)] uppercase tracking-wider font-semibold">
              {admin.panelTab === 'edit' ? 'Field Editor' : admin.panelTab === 'design' ? 'Design' : 'Sections'}
            </span>
            <button type="button" onClick={() => setPanelOpen(false)} className="text-[#9fa4b0] hover:text-[#f3f2ee]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {admin.panelTab === 'edit' && <EditPanel />}
            {admin.panelTab === 'design' && <DesignPanel />}
            {admin.panelTab === 'sections' && <SectionsPanel />}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="fixed top-1/2 right-0 z-[9998] -translate-y-1/2 px-1.5 py-3 rounded-l-sm bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] shadow-xl"
          data-admin-ui
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* Spacer for toolbar */}
      <div className="h-[42px]" aria-hidden />
    </>
  );
};

export const AdminEditFab: React.FC = () => {
  const admin = useAdmin();
  if (!admin.isAuthenticated || admin.editMode) return null;

  return (
    <button
      type="button"
      onClick={() => admin.setEditMode(true)}
      className="fixed bottom-6 right-6 z-[9990] flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] font-semibold text-xs shadow-2xl hover:scale-105 transition-transform"
      data-admin-ui
    >
      <Pencil className="w-4 h-4" />
      Edit Page
    </button>
  );
};

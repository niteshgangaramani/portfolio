import React, { useCallback, useRef, useState } from 'react';
import { Pencil, ImageIcon } from 'lucide-react';
import { useAdminOptional } from './AdminContext';

function editRing(selected: boolean) {
  return selected
    ? 'outline outline-2 outline-[var(--admin-accent,#c5a880)] outline-offset-2 bg-[var(--admin-accent,#c5a880)]/5'
    : 'hover:outline hover:outline-2 hover:outline-[var(--admin-accent,#c5a880)]/50 hover:outline-offset-2 hover:bg-[var(--admin-accent,#c5a880)]/5';
}

interface EditableTextProps {
  path: string;
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  inlineEdit?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  path,
  children,
  className = '',
  as: Tag = 'span',
  inlineEdit = true,
}) => {
  const admin = useAdminOptional();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const ref = useRef<HTMLElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!admin?.editMode) return;
      e.preventDefault();
      e.stopPropagation();
      admin.selectPath(path);
      admin.setPanelTab('edit');
    },
    [admin, path]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!admin?.editMode || !inlineEdit) return;
      e.preventDefault();
      e.stopPropagation();
      setDraft(String(children ?? ''));
      setEditing(true);
      admin.selectPath(path);
    },
    [admin, children, inlineEdit, path]
  );

  const commitInline = useCallback(() => {
    if (admin) admin.updateField(path, draft);
    setEditing(false);
  }, [admin, draft, path]);

  if (!admin?.editMode) {
    return <Tag className={className}>{children}</Tag>;
  }

  const selected = admin.selectedPath === path;

  if (editing) {
    return (
      <Tag className={`${className} relative`}>
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitInline}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitInline();
            }
            if (e.key === 'Escape') setEditing(false);
          }}
          className="w-full min-h-[2.5rem] bg-[#101218] border border-[var(--admin-accent,#c5a880)] rounded-sm px-2 py-1 text-inherit resize-y"
        />
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      data-edit-path={path}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`${className} relative cursor-pointer transition-all rounded-sm ${editRing(selected)} group`}
      title="Click to edit · Double-click for inline edit"
    >
      {children}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-xs bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] text-[9px] font-mono font-bold shadow-lg">
          <Pencil className="w-2.5 h-2.5" />
          EDIT
        </span>
      </span>
    </Tag>
  );
};

interface EditableImageProps {
  path: string;
  children: React.ReactNode;
  className?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({ path, children, className = '' }) => {
  const admin = useAdminOptional();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!admin?.editMode) return <div className={className}>{children}</div>;

  const selected = admin.selectedPath === path;

  return (
    <div
      data-edit-path={path}
      className={`${className} relative cursor-pointer transition-all rounded-sm ${editRing(selected)} group`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        admin.selectPath(path);
        admin.setPanelTab('edit');
      }}
      title="Click to change image"
    >
      {children}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="absolute bottom-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-xs bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
      >
        <ImageIcon className="w-3 h-3" />
        Replace
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            admin.updateField(path, String(reader.result));
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
};

interface EditableBlockProps {
  path: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const EditableBlock: React.FC<EditableBlockProps> = ({ path, label, children, className = '' }) => {
  const admin = useAdminOptional();

  if (!admin?.editMode) return <div className={className}>{children}</div>;

  const selected = admin.selectedPath === path || admin.selectedPath?.startsWith(`${path}.`);

  return (
    <div
      data-edit-path={path}
      className={`${className} relative transition-all rounded-sm ${editRing(selected)}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        admin.selectPath(path);
        admin.setPanelTab('edit');
      }}
    >
      {label && (
        <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-xs bg-[#0d0f12]/90 border border-[var(--admin-accent,#c5a880)]/40 text-[10px] font-mono text-[var(--admin-accent,#c5a880)] pointer-events-none">
          {label}
        </span>
      )}
      {children}
    </div>
  );
};

interface EditableLinkProps {
  path: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const EditableLink: React.FC<EditableLinkProps> = ({
  path,
  href,
  children,
  className = '',
  external = true,
}) => {
  const admin = useAdminOptional();

  if (!admin?.editMode) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  const selected = admin.selectedPath === path;

  return (
    <span
      role="button"
      tabIndex={0}
      data-edit-path={path}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        admin.selectPath(path);
        admin.setPanelTab('edit');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          admin.selectPath(path);
          admin.setPanelTab('edit');
        }
      }}
      className={`${className} cursor-pointer transition-all rounded-sm inline-flex items-center gap-1 ${editRing(selected)}`}
      title={`Edit URL: ${href}`}
    >
      {children}
      <span className="text-[8px] font-mono opacity-70 uppercase tracking-wide">edit</span>
    </span>
  );
};

/** Renders `<a>` in preview, non-navigating editable block in admin edit mode. */
export const EditableAnchor: React.FC<{
  path: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ path, href, children, className = '', external, onClick }) => {
  const admin = useAdminOptional();

  if (!admin?.editMode) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  const selected = admin.selectedPath === path;

  return (
    <div
      role="button"
      tabIndex={0}
      data-edit-path={path}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        admin.selectPath(path);
        admin.setPanelTab('edit');
      }}
      className={`${className} cursor-pointer transition-all rounded-sm ${editRing(selected)}`}
      title={`Click to edit: ${path}`}
    >
      {children}
    </div>
  );
};

interface EditableSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/** Clickable wrapper for array fields (highlights, tags) — opens list editor in side panel. */
export const EditableArrayField: React.FC<{
  path: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
}> = ({ path, children, className = '', label = 'Edit list' }) => {
  const admin = useAdminOptional();

  if (!admin?.editMode) {
    return <div className={className}>{children}</div>;
  }

  const selected = admin.selectedPath === path;

  return (
    <div
      role="button"
      tabIndex={0}
      data-edit-path={path}
      onClick={(e) => {
        e.stopPropagation();
        admin.selectPath(path);
        admin.setPanelTab('edit');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          admin.selectPath(path);
          admin.setPanelTab('edit');
        }
      }}
      className={`${className} cursor-pointer rounded-sm transition-all ${editRing(selected)}`}
      title={label}
    >
      {children}
      <span className="block mt-1 text-[9px] font-mono text-[var(--admin-accent,#c5a880)]/70 uppercase tracking-wide">
        Click to edit list
      </span>
    </div>
  );
};

export const EditableSection: React.FC<EditableSectionProps> = ({ id, children, className = '' }) => {
  const admin = useAdminOptional();

  if (!admin?.editMode) return <>{children}</>;

  return (
    <div
      className={`${className} relative group/section`}
      data-edit-section={id}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-edit-path]')) return;
        admin.setPanelTab('sections');
      }}
    >
      <div className="absolute top-4 left-4 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity pointer-events-none">
        <span className="px-2 py-1 rounded-xs bg-[#0d0f12]/95 border border-[var(--admin-accent,#c5a880)]/50 text-[10px] font-mono text-[var(--admin-accent,#c5a880)] uppercase tracking-wider">
          Section: {id}
        </span>
      </div>
      {children}
    </div>
  );
};

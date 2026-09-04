import React, { useRef, useState } from 'react';
import { Building2, Award, User, Newspaper, Video, Layers, Image as ImageIcon } from 'lucide-react';
import { EditableText } from '../admin/Editable';
import { useAdminOptional } from '../admin/AdminContext';

export interface ImageEditPaths {
  src?: string;
  title?: string;
  category?: string;
}

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  category?: string;
  title?: string;
  iconType?: 'building' | 'award' | 'user' | 'news' | 'video' | 'gallery' | 'default';
  aspectRatio?: string;
  fit?: 'cover' | 'contain';
  objectPosition?: string;
  className?: string;
  onClick?: () => void;
  editPaths?: ImageEditPaths;
  showImageOverlay?: boolean;
  replaceLabel?: string;
}

function editRing(selected: boolean) {
  return selected
    ? 'outline outline-2 outline-[var(--admin-accent,#c5a880)] outline-offset-1'
    : 'hover:outline hover:outline-2 hover:outline-[var(--admin-accent,#c5a880)]/50 hover:outline-offset-1';
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  src,
  alt = 'Placeholder image',
  category,
  title,
  iconType = 'default',
  aspectRatio = 'aspect-video',
  fit = 'cover',
  objectPosition = 'center',
  className = '',
  onClick,
  editPaths,
  showImageOverlay = true,
  replaceLabel = 'Replace',
}) => {
  const [imageError, setImageError] = useState(false);
  const admin = useAdminOptional();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditMode = admin?.editMode ?? false;
  const hasOverlayContent = showImageOverlay && (category || title);
  const srcPath = editPaths?.src;

  const renderIcon = () => {
    switch (iconType) {
      case 'building':
        return <Building2 className="w-8 h-8 text-[#c5a880]/80" />;
      case 'award':
        return <Award className="w-8 h-8 text-[#c5a880]/80" />;
      case 'user':
        return <User className="w-8 h-8 text-[#c5a880]/80" />;
      case 'news':
        return <Newspaper className="w-8 h-8 text-[#c5a880]/80" />;
      case 'video':
        return <Video className="w-8 h-8 text-[#c5a880]/80" />;
      case 'gallery':
        return <ImageIcon className="w-8 h-8 text-[#c5a880]/80" />;
      default:
        return <Layers className="w-8 h-8 text-[#c5a880]/80" />;
    }
  };

  const renderOverlayLabels = (compact = false) => {
    if (!category && !title) return null;

    const categoryClass = compact
      ? 'text-[9px] uppercase tracking-[0.15em] text-[#c5a880] font-mono font-semibold'
      : 'text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-mono font-semibold';

    const titleClass = compact
      ? 'text-[11px] sm:text-xs font-serif-title text-[#f3f2ee] line-clamp-2 leading-snug'
      : 'text-xs font-serif-title text-[#e8e6e1] line-clamp-2 italic tracking-wide';

    return (
      <div
        className="relative z-10 space-y-0.5"
        onClick={(e) => isEditMode && e.stopPropagation()}
      >
        {category &&
          (editPaths?.category ? (
            <EditableText path={editPaths.category} className={categoryClass}>
              {category}
            </EditableText>
          ) : (
            <span className={categoryClass}>{category}</span>
          ))}
        {title &&
          (editPaths?.title ? (
            <EditableText path={editPaths.title} as="p" className={titleClass}>
              {title}
            </EditableText>
          ) : (
            <p className={titleClass}>{title}</p>
          ))}
      </div>
    );
  };

  const handleImageAreaClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    if (!isEditMode || !srcPath || !admin) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-edit-path]') && !target.closest('[data-edit-path]')?.contains(e.currentTarget)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    admin.selectPath(srcPath);
    admin.setPanelTab('edit');
  };

  const hasValidSrc = src && src.trim() !== '' && !imageError;

  if (hasValidSrc) {
    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
    const hoverScaleClass = fit === 'contain' ? '' : 'group-hover:scale-105';
    const srcSelected = isEditMode && srcPath && admin?.selectedPath === srcPath;

    return (
      <div
        className={`relative overflow-hidden ${aspectRatio} ${fit === 'contain' ? 'bg-[#10131a]' : ''} ${className} group`}
        data-edit-path={isEditMode && srcPath ? srcPath : undefined}
        onClick={handleImageAreaClick}
      >
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className={`w-full h-full ${fitClass} transition-transform duration-700 ease-out ${hoverScaleClass} ${isEditMode && srcPath ? 'cursor-pointer' : ''} ${srcSelected ? editRing(true) : ''}`}
          style={{ objectPosition }}
          loading="lazy"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0d0f12]/90 via-[#0d0f12]/30 to-transparent pointer-events-none ${
            fit === 'contain' ? 'opacity-80' : 'opacity-70'
          }`}
        />

        {hasOverlayContent && (
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 pointer-events-none">
            <div className="pointer-events-auto">{renderOverlayLabels(true)}</div>
          </div>
        )}

        {isEditMode && srcPath && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileRef.current?.click();
              }}
              className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-xs bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] text-[10px] font-mono font-bold shadow-lg opacity-100"
            >
              <ImageIcon className="w-3 h-3" />
              {replaceLabel}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !admin) return;
                const reader = new FileReader();
                reader.onload = () => admin.updateField(srcPath, String(reader.result));
                reader.readAsDataURL(file);
              }}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleImageAreaClick}
      data-edit-path={isEditMode && srcPath ? srcPath : undefined}
      className={`relative w-full ${aspectRatio} bg-gradient-to-br from-[#181b22] via-[#12141a] to-[#0e1014] border border-[#262b38] rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none ${className} ${onClick || (isEditMode && srcPath) ? 'cursor-pointer hover:border-[#c5a880]/50 transition-colors' : ''} ${isEditMode && srcPath ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#c5a880]/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#c5a880]/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#c5a880]/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#c5a880]/40" />

      <div className="relative z-10 flex flex-col items-center gap-3 max-w-[85%]">
        <div className="p-3.5 rounded-full bg-[#1e232d]/80 border border-[#c5a880]/30 shadow-inner">
          {renderIcon()}
        </div>

        {renderOverlayLabels(false)}

        <div className="flex items-center gap-1.5 text-[10px] text-[#7a8190] font-mono uppercase tracking-wider pt-1">
          <ImageIcon className="w-3 h-3 text-[#c5a880]/60" />
          <span>{isEditMode && srcPath ? 'Click to upload image' : 'Image Placeholder'}</span>
        </div>
      </div>

      {isEditMode && srcPath && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
            className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-xs bg-[var(--admin-accent,#c5a880)] text-[#0d0f12] text-[10px] font-mono font-bold shadow-lg"
          >
            <ImageIcon className="w-3 h-3" />
            {replaceLabel}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !admin) return;
              const reader = new FileReader();
              reader.onload = () => admin.updateField(srcPath, String(reader.result));
              reader.readAsDataURL(file);
            }}
          />
        </>
      )}
    </div>
  );
};

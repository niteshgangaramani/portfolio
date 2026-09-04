import React, { useCallback, useEffect, useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { GalleryModal } from './GalleryModal';
import { GalleryItemData, SectionHeadingOverride } from '../types';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { EditableText } from '../admin/Editable';
import { useIsEditMode } from '../admin/EditModeGuard';
import { useAdminOptional } from '../admin/AdminContext';

type GalleryTab = 'portfolio' | 'csr';

interface GalleryProps {
  gallery: GalleryItemData[];
  csr: GalleryItemData[];
  heading?: SectionHeadingOverride;
  csrHeading?: SectionHeadingOverride;
}

const AUTOPLAY_MS = 3000;

const EMPTY_CSR_TEMPLATE: Record<string, unknown> = {
  id: 'csr',
  caption: 'CSR caption',
  category: 'CSR',
  aspectRatio: 'aspect-[4/3]',
  src: '',
};

const EMPTY_GALLERY_TEMPLATE: Record<string, unknown> = {
  id: 'gallery',
  caption: 'Caption',
  category: 'General',
  aspectRatio: 'aspect-[4/3]',
  src: '',
};

interface SlideshowProps {
  items: GalleryItemData[];
  dataPath: 'gallery' | 'csr';
  emptyTemplate: Record<string, unknown>;
}

const GallerySlideshow: React.FC<SlideshowProps> = ({ items, dataPath, emptyTemplate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const isEditMode = useIsEditMode();
  const admin = useAdminOptional();

  useEffect(() => {
    setActiveIndex(0);
    setProgress(0);
    setActiveModalIndex(null);
  }, [dataPath]);

  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex >= items.length) setActiveIndex(items.length - 1);
  }, [items.length, activeIndex]);

  const activeItem = items[activeIndex];
  const selectedItem = activeModalIndex !== null ? items[activeModalIndex] : null;
  const basePath = `${dataPath}.${activeIndex}`;

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > activeIndex ? 1 : idx < activeIndex ? -1 : 0);
      setActiveIndex(idx);
      setProgress(0);
    },
    [activeIndex]
  );

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    setDirection(1);
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    setProgress(0);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    setProgress(0);
  }, [items.length]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (isEditMode) return;
    if (info.offset.x < -30 || info.velocity.x < -300) handleNext();
    else if (info.offset.x > 30 || info.velocity.x > 300) handlePrev();
  };

  useEffect(() => {
    if (!isPlaying || isEditMode || items.length <= 1 || activeModalIndex !== null) return;

    setProgress(0);
    let elapsed = 0;
    const tick = 50;

    const interval = window.setInterval(() => {
      elapsed += tick;
      setProgress(Math.min(100, (elapsed / AUTOPLAY_MS) * 100));
      if (elapsed >= AUTOPLAY_MS) handleNext();
    }, tick);

    return () => window.clearInterval(interval);
  }, [isPlaying, isEditMode, activeIndex, items.length, handleNext, activeModalIndex]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 100 : -100, opacity: 0, scale: 0.98 }),
  };

  if (items.length === 0 || !activeItem) {
    return (
      <div className="mt-4 rounded-sm border border-dashed border-[#232835] bg-[#0e1116] aspect-[16/10] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-[#9fa4b0] font-mono">
          {dataPath === 'csr' ? 'No CSR images yet' : 'No gallery images yet'}
        </p>
        {isEditMode && admin && (
          <button
            type="button"
            data-edit-allow
            onClick={() => {
              admin.addArrayItem(dataPath, emptyTemplate);
              admin.setPanelTab('sections');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[var(--admin-accent,#c5a880)]/50 text-[11px] font-mono text-[var(--admin-accent,#c5a880)] hover:bg-[var(--admin-accent,#c5a880)]/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Add {dataPath === 'csr' ? 'CSR' : 'gallery'} image
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-xs font-mono text-[#c5a880] font-semibold">
          {activeIndex + 1} / {items.length}
          <span className="text-[#6b7280] font-normal ml-2 hidden sm:inline">• {activeItem.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-edit-allow
            onClick={() => setIsPlaying((p) => !p)}
            className="p-2 rounded-sm border border-[#232835] text-[#9fa4b0] hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-colors"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            data-edit-allow
            onClick={handlePrev}
            className="p-2 rounded-sm border border-[#232835] text-[#9fa4b0] hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-edit-allow
            onClick={handleNext}
            className="p-2 rounded-sm border border-[#232835] text-[#9fa4b0] hover:text-[#c5a880] hover:border-[#c5a880]/40 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-0.5 bg-[#232835] rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-[#c5a880]"
          animate={{ width: `${isPlaying && !isEditMode ? progress : 0}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>

      <div
        className="relative"
        onMouseEnter={() => !isEditMode && setIsPlaying(false)}
        onMouseLeave={() => !isEditMode && setIsPlaying(true)}
      >
        <div
          className="relative aspect-[16/10] w-full bg-[#0e1116] border border-[#232835] rounded-sm shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          data-edit-path={isEditMode ? basePath : undefined}
          onClick={(e) => {
            if (!isEditMode) return;
            e.stopPropagation();
            admin?.selectPath(basePath);
            admin?.setPanelTab('edit');
          }}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeItem.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              drag={isEditMode ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="absolute inset-0"
            >
              <div
                className="relative w-full h-full group cursor-pointer"
                onClick={() => {
                  if (isEditMode) return;
                  setActiveModalIndex(activeIndex);
                }}
              >
                <ImagePlaceholder
                  src={activeItem.src}
                  alt={activeItem.caption}
                  title={activeItem.caption}
                  category={activeItem.category}
                  iconType="gallery"
                  aspectRatio="h-full"
                  fit="contain"
                  className="h-full w-full"
                  showImageOverlay={false}
                  editPaths={{
                    src: `${basePath}.src`,
                    title: `${basePath}.caption`,
                    category: `${basePath}.category`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12]/90 via-transparent to-transparent pointer-events-none" />
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalIndex(activeIndex);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-[#1a1e28]/90 text-[#c5a880] rounded-full border border-[#c5a880]/40 hover:scale-110 transition-transform z-10"
                    aria-label="Expand image"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 min-h-[7.5rem] flex flex-col justify-end z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a880] mb-2 block font-semibold">
                    <EditableText path={`${basePath}.category`}>{activeItem.category}</EditableText>
                  </span>
                  <p className="text-lg sm:text-xl font-serif-title font-medium text-[#f3f2ee] leading-snug max-w-3xl line-clamp-2">
                    <EditableText path={`${basePath}.caption`}>{activeItem.caption}</EditableText>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          data-edit-allow
          onClick={handlePrev}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#14171f] border border-[#c5a880]/40 text-[#c5a880] shadow-xl hover:bg-[#c5a880] hover:text-[#0d0f12] transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          data-edit-allow
          onClick={handleNext}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-[#14171f] border border-[#c5a880]/40 text-[#c5a880] shadow-xl hover:bg-[#c5a880] hover:text-[#0d0f12] transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            data-edit-allow
            onClick={() => goTo(idx)}
            className={`relative shrink-0 w-24 sm:w-28 rounded-sm overflow-hidden border-2 transition-all ${
              activeIndex === idx
                ? 'border-[#c5a880] shadow-lg shadow-[#c5a880]/20 scale-105'
                : 'border-[#232835] opacity-70 hover:opacity-100 hover:border-[#c5a880]/40'
            }`}
            aria-label={`View ${item.caption}`}
            aria-current={activeIndex === idx ? 'true' : undefined}
          >
            <ImagePlaceholder
              src={item.src}
              alt={item.caption}
              title={item.caption}
              category={item.category}
              iconType="gallery"
              aspectRatio="aspect-square"
              fit="cover"
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            data-edit-allow
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              activeIndex === idx ? 'w-8 bg-[#c5a880]' : 'w-2 bg-[#2a3040] hover:bg-[#8c92a0]'
            }`}
          />
        ))}
      </div>

      <GalleryModal
        item={selectedItem}
        onClose={() => setActiveModalIndex(null)}
        onNext={() => {
          if (activeModalIndex !== null) {
            const next = (activeModalIndex + 1) % items.length;
            setActiveModalIndex(next);
            goTo(next);
          }
        }}
        onPrev={() => {
          if (activeModalIndex !== null) {
            const prev = (activeModalIndex - 1 + items.length) % items.length;
            setActiveModalIndex(prev);
            goTo(prev);
          }
        }}
      />
    </div>
  );
};

export const Gallery: React.FC<GalleryProps> = ({ gallery, csr, heading, csrHeading }) => {
  const [tab, setTab] = useState<GalleryTab>('portfolio');
  const isEditMode = useIsEditMode();

  const activeHeading = tab === 'portfolio' ? heading : csrHeading;
  const headingKey = tab === 'portfolio' ? 'gallery' : 'csr';

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#0d0f12] relative overflow-hidden border-t border-[#1e232e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow={activeHeading?.eyebrow ?? (tab === 'portfolio' ? 'GALLERY' : 'CSR')}
          title={
            activeHeading?.title ??
            (tab === 'portfolio' ? 'Visual Portfolio' : 'Corporate Social Responsibility')
          }
          subtitle={
            activeHeading?.subtitle ??
            (tab === 'portfolio'
              ? 'Moments from projects, events, and leadership journeys.'
              : 'Community initiatives, social impact, and giving back.')
          }
          align="center"
          editPaths={{
            eyebrow: `settings.headings.${headingKey}.eyebrow`,
            title: `settings.headings.${headingKey}.title`,
            subtitle: `settings.headings.${headingKey}.subtitle`,
          }}
        />

        <div className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Gallery tabs"
            className="inline-flex p-1 rounded-sm border border-[#232835] bg-[#101218]"
          >
            {(
              [
                { id: 'portfolio' as const, label: 'Visual Portfolio' },
                { id: 'csr' as const, label: 'CSR' },
              ] as const
            ).map(({ id, label }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  data-edit-allow
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className={`px-4 sm:px-6 py-2 text-[11px] sm:text-xs font-mono tracking-wide transition-colors rounded-sm ${
                    active
                      ? 'bg-[#c5a880] text-[#0d0f12] font-semibold'
                      : 'text-[#9fa4b0] hover:text-[#f3f2ee]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {isEditMode && (
          <p className="mt-3 text-center text-[10px] font-mono text-[#7a8190]">
            Editing {tab === 'portfolio' ? 'gallery' : 'csr'} slides — click an image or use Sections → Add / Delete
          </p>
        )}

        <div className="mt-6 sm:mt-8">
          {tab === 'portfolio' ? (
            <GallerySlideshow items={gallery} dataPath="gallery" emptyTemplate={EMPTY_GALLERY_TEMPLATE} />
          ) : (
            <GallerySlideshow items={csr} dataPath="csr" emptyTemplate={EMPTY_CSR_TEMPLATE} />
          )}
        </div>
      </div>
    </section>
  );
};

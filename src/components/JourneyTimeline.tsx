import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { JourneyItem } from './JourneyItem';
import { JourneyItemData, SectionHeadingOverride } from '../types';
import { Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { EditableBlock, EditableText, EditableArrayField } from '../admin/Editable';
import { useIsEditMode } from '../admin/EditModeGuard';

interface JourneyTimelineProps {
  items: JourneyItemData[];
  heading?: SectionHeadingOverride;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ items, heading }) => {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const isEditMode = useIsEditMode();

  const activeItem = items[activeMobileIndex];
  const mobileBasePath = `journey.${activeMobileIndex}`;

  const handlePrev = () => {
    setDirection(-1);
    setActiveMobileIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveMobileIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Framer Motion Drag Handler
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -30 || info.velocity.x < -300) {
      handleNext();
    } else if (info.offset.x > 30 || info.velocity.x > 300) {
      handlePrev();
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
  };

  return (
    <section id="journey" className="py-16 sm:py-28 bg-[#0a0c0f] relative overflow-hidden border-t border-[#1e232e]">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'CAREER EVOLUTION'}
          title={heading?.title ?? 'Two Decades of Transformation'}
          subtitle={heading?.subtitle ?? "From managing live site construction in Mumbai to scaling a top-5 developer in Dubai and establishing a ₹4,500 Cr order book across India."}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.journey.eyebrow',
            title: 'settings.headings.journey.title',
            subtitle: 'settings.headings.journey.subtitle',
          }}
        />

        {/* --- MOBILE CAROUSEL & YEAR SELECTOR DECK (Visible on mobile/tablet < lg) --- */}
        <div className="block lg:hidden mt-8">
          
          {/* Year Pills Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none px-1">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-edit-allow
                onClick={() => {
                  setDirection(idx > activeMobileIndex ? 1 : -1);
                  setActiveMobileIndex(idx);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMobileIndex === idx
                    ? 'bg-[#c5a880] text-[#0d0f12] font-bold shadow-lg shadow-[#c5a880]/20 scale-105'
                    : 'bg-[#141822] text-[#8c92a0] border border-[#232938] hover:text-[#e8e6e1]'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{item.year}</span>
              </button>
            ))}
          </div>

          {/* Header Info */}
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#c5a880]">
            <span className="font-semibold">
              PHASE {activeMobileIndex + 1} OF {items.length} • {activeItem.year}
            </span>
          </div>

          {/* Active Career Phase Card with Touch & Motion Drag */}
          <div className={`cursor-grab active:cursor-grabbing select-none relative bg-[#141822] border border-[#2a3040] rounded-lg p-6 shadow-2xl overflow-hidden ${isEditMode ? 'ring-1 ring-[var(--admin-accent,#c5a880)]/30' : ''}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a880]/5 rounded-full blur-2xl pointer-events-none" />
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeItem.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                drag={isEditMode ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={isEditMode ? undefined : handleDragEnd}
                className="space-y-4"
                data-edit-path={isEditMode ? mobileBasePath : undefined}
              >
                <div className="flex items-center justify-between border-b border-[#232835] pb-3">
                  <span className="text-xs font-mono text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/20 px-2.5 py-1 rounded-sm font-semibold">
                    <EditableText path={`${mobileBasePath}.year`}>{activeItem.year}</EditableText>
                  </span>
                  <span className="text-[11px] font-mono text-[#6b7280]">
                    <EditableText path={`${mobileBasePath}.location`}>{activeItem.location}</EditableText>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-serif-title font-bold text-[#f3f2ee] mb-1">
                    <EditableText path={`${mobileBasePath}.title`}>{activeItem.title}</EditableText>
                  </h3>
                </div>

                <p className="text-xs text-[#a2a8b8] font-sans-body leading-relaxed">
                  <EditableText path={`${mobileBasePath}.description`} as="span">{activeItem.description}</EditableText>
                </p>

                {activeItem.highlights && activeItem.highlights.length > 0 && (
                  <EditableArrayField
                    path={`${mobileBasePath}.highlights`}
                    className="space-y-2 pt-2 border-t border-[#1e2330]"
                    label="Edit highlights"
                  >
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#c5a880] font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Strategic Milestones
                    </span>
                    <ul className="space-y-1.5">
                      {activeItem.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-[#d1d5db] font-sans-body flex items-start gap-2">
                          <span className="text-[#c5a880] text-sm leading-none mt-0.5">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </EditableArrayField>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots Only */}
            <div className="flex items-center justify-center pt-6 mt-6 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-edit-allow
                    onClick={() => {
                      setDirection(idx > activeMobileIndex ? 1 : -1);
                      setActiveMobileIndex(idx);
                    }}
                    aria-label={`Go to phase ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeMobileIndex === idx ? 'w-7 bg-[#c5a880]' : 'w-2.5 bg-[#2a3040] hover:bg-[#8c92a0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- DESKTOP FULL TIMELINE GRID (Visible on lg screens) --- */}
        <div className="hidden lg:block relative mt-16">
          
          {/* Vertical Center Line for Desktop Timeline */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#c5a880]/20 via-[#c5a880]/50 to-[#c5a880]/20" />

          {/* Timeline Items */}
          <div className="space-y-0">
            {items.map((item, index) => (
              <EditableBlock key={item.id} path={`journey.${index}`} label={item.year}>
                <JourneyItem item={item} index={index} isEven={index % 2 === 0} basePath={`journey.${index}`} />
              </EditableBlock>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};


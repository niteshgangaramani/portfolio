import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { PhilosophyCard } from './PhilosophyCard';
import { PhilosophyItem, SectionHeadingOverride } from '../types';
import { Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditableBlock } from '../admin/Editable';

interface PhilosophyGridProps {
  philosophy: PhilosophyItem[];
  heading?: SectionHeadingOverride;
}

export const PhilosophyGrid: React.FC<PhilosophyGridProps> = ({ philosophy, heading }) => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const activeItem = philosophy[mobileIndex];

  const handlePrev = () => {
    setDirection(-1);
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : philosophy.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setMobileIndex((prev) => (prev < philosophy.length - 1 ? prev + 1 : 0));
  };

  // Framer Motion Drag Handler (Single-step advance per swipe)
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
    <section id="philosophy" className="py-16 sm:py-28 bg-[#0d0f12] relative overflow-hidden border-t border-[#1e232e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'LEADERSHIP CULTURE'}
          title={heading?.title ?? 'The 8 Es of Business'}
          subtitle={heading?.subtitle ?? 'My personal strength and leadership philosophy grow from a distinct culture founded on core values:'}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.philosophy.eyebrow',
            title: 'settings.headings.philosophy.title',
            subtitle: 'settings.headings.philosophy.subtitle',
          }}
        />

        {/* --- MOBILE & TOUCH CAROUSEL VIEW (< sm screens) --- */}
        <div className="block sm:hidden">
          
          {/* Scrollable Number Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none px-0.5">
            {philosophy.map((item, idx) => (
              <button
                key={item.number}
                type="button"
                data-edit-allow
                onClick={() => {
                  setDirection(idx > mobileIndex ? 1 : -1);
                  setMobileIndex(idx);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-full shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                  mobileIndex === idx
                    ? 'bg-[#c5a880] text-[#0d0f12] font-bold shadow-md scale-105'
                    : 'bg-[#141822] text-[#8c92a0] border border-[#232938]'
                }`}
              >
                <span>E{idx + 1}: {item.title}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-mono text-[#c5a880]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Compass className="w-3.5 h-3.5" /> Principle {mobileIndex + 1} of 8
              </span>
            </div>

            {/* Touch Swipeable Card Wrapper */}
            <div className="cursor-grab active:cursor-grabbing select-none relative min-h-[320px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeItem.number}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="w-full"
                >
                  <PhilosophyCard item={activeItem} basePath={`philosophy.${mobileIndex}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots Only */}
            <div className="flex items-center justify-center pt-4 mt-2 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {philosophy.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-edit-allow
                    onClick={() => {
                      setDirection(idx > mobileIndex ? 1 : -1);
                      setMobileIndex(idx);
                    }}
                    aria-label={`Go to principle ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      mobileIndex === idx ? 'w-7 bg-[#c5a880]' : 'w-2.5 bg-[#2c3344] hover:bg-[#8c92a0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* --- DESKTOP GRID & TOUCH CAROUSEL OPTION (Visible on sm+ screens) --- */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {philosophy.map((item, idx) => (
            <EditableBlock key={item.number} path={`philosophy.${idx}`} label={item.title}>
              <PhilosophyCard item={item} basePath={`philosophy.${idx}`} />
            </EditableBlock>
          ))}
        </div>

      </div>
    </section>
  );
};



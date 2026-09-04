import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { AwardCard } from './AwardCard';
import { AwardData, SectionHeadingOverride } from '../types';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditableBlock } from '../admin/Editable';

interface AchievementsSectionProps {
  awards: AwardData[];
  heading?: SectionHeadingOverride;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ awards, heading }) => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const activeAward = awards[mobileIndex];

  const handlePrev = () => {
    setDirection(-1);
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : awards.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setMobileIndex((prev) => (prev < awards.length - 1 ? prev + 1 : 0));
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
    <section id="achievements" className="py-16 sm:py-28 bg-[#0a0c0f] relative overflow-hidden border-t border-[#1e232e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'RECOGNITION & HONORS'}
          title={heading?.title ?? 'Milestones of Excellence'}
          subtitle={heading?.subtitle ?? 'Honors conferred by leading international publications, government organizations, and industry bodies for execution leadership.'}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.achievements.eyebrow',
            title: 'settings.headings.achievements.title',
            subtitle: 'settings.headings.achievements.subtitle',
          }}
        />

        {/* --- MOBILE CAROUSEL (Visible on < md) --- */}
        <div className="block md:hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#c5a880]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Trophy className="w-3.5 h-3.5" /> Award {mobileIndex + 1} of {awards.length}
              </span>
            </div>

            {/* Touch & Drag Swipeable Card Wrapper */}
            <div className="cursor-grab active:cursor-grabbing select-none relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeAward.id}
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
                  <AwardCard award={activeAward} basePath={`awards.${mobileIndex}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots Only */}
            <div className="flex items-center justify-center pt-4 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {awards.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > mobileIndex ? 1 : -1);
                      setMobileIndex(idx);
                    }}
                    aria-label={`Go to award ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      mobileIndex === idx ? 'w-7 bg-[#c5a880]' : 'w-2.5 bg-[#2c3344] hover:bg-[#8c92a0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- DESKTOP GRID (Visible on md+ screens) --- */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awards.map((award, idx) => (
            <EditableBlock key={award.id} path={`awards.${idx}`} label={award.title}>
              <AwardCard award={award} basePath={`awards.${idx}`} />
            </EditableBlock>
          ))}
        </div>

      </div>
    </section>
  );
};


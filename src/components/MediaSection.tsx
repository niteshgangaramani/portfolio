import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { MediaCard } from './MediaCard';
import { MediaArticleData, SectionHeadingOverride } from '../types';
import { Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditableBlock } from '../admin/Editable';

interface MediaSectionProps {
  articles: MediaArticleData[];
  heading?: SectionHeadingOverride;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ articles, heading }) => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  const activeArticle = articles[mobileIndex];

  const handlePrev = () => {
    setDirection(-1);
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : articles.length - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setMobileIndex((prev) => (prev < articles.length - 1 ? prev + 1 : 0));
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
    <section id="media" className="py-16 sm:py-28 bg-[#0d0f12] relative overflow-hidden border-t border-[#1e232e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'PRESS & MEDIA'}
          title={heading?.title ?? 'In the Press'}
          subtitle={heading?.subtitle ?? 'Coverage, features, and thought leadership articles across national business dailies, real estate journals, and news portals.'}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.media.eyebrow',
            title: 'settings.headings.media.title',
            subtitle: 'settings.headings.media.subtitle',
          }}
        />

        {/* --- MOBILE CAROUSEL (Visible on < md) --- */}
        <div className="block md:hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#c5a880]">
              <span className="flex items-center gap-1.5 font-semibold">
                <Newspaper className="w-3.5 h-3.5" /> Article {mobileIndex + 1} of {articles.length}
              </span>
            </div>

            {/* Touch & Drag Swipeable Card Wrapper */}
            <div className="cursor-grab active:cursor-grabbing select-none relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeArticle.id}
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
                  <MediaCard article={activeArticle} basePath={`media.${mobileIndex}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls - Dots Only */}
            <div className="flex items-center justify-center pt-4 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {articles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > mobileIndex ? 1 : -1);
                      setMobileIndex(idx);
                    }}
                    aria-label={`Go to article ${idx + 1}`}
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
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <EditableBlock key={article.id} path={`media.${idx}`} label={article.title}>
              <MediaCard article={article} basePath={`media.${idx}`} />
            </EditableBlock>
          ))}
        </div>

      </div>
    </section>
  );
};



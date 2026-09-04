import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { ProjectCard } from './ProjectCard';
import { ProjectData, SectionHeadingOverride } from '../types';
import { Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EditableBlock } from '../admin/Editable';

interface ProjectGridProps {
  projects: ProjectData[];
  heading?: SectionHeadingOverride;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, heading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mobileProjectIndex, setMobileProjectIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  // Extract unique categories
  const categories: string[] = ['All', ...Array.from(new Set<string>(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const safeMobileIndex = Math.min(mobileProjectIndex, filteredProjects.length - 1);
  const activeMobileProject = filteredProjects[safeMobileIndex] || filteredProjects[0];

  const handleMobilePrev = () => {
    setDirection(-1);
    setMobileProjectIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
  };

  const handleMobileNext = () => {
    setDirection(1);
    setMobileProjectIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setMobileProjectIndex(0);
    setDirection(0);
  };

  // Framer Motion Drag Handler
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -30 || info.velocity.x < -300) {
      handleMobileNext();
    } else if (info.offset.x > 30 || info.velocity.x > 300) {
      handleMobilePrev();
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
    <section id="portfolio" className="py-16 sm:py-28 bg-[#0a0c0f] relative overflow-hidden border-t border-[#1e232e]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'PORTFOLIO & LANDMARKS'}
          title={heading?.title ?? 'Shaping Skylines and Infrastructure'}
          subtitle={heading?.subtitle ?? 'A track record of mega-scale infrastructure, diplomatic civic landmarks, and luxury residential developments delivered across Dubai and India.'}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.portfolio.eyebrow',
            title: 'settings.headings.portfolio.title',
            subtitle: 'settings.headings.portfolio.subtitle',
          }}
        />

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mb-8 pb-3 overflow-x-auto scrollbar-none border-b border-[#202532]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase rounded-xs transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#c5a880] text-[#0d0f12] font-semibold shadow-md shadow-[#c5a880]/10'
                  : 'bg-[#14171f] text-[#8c92a0] hover:text-[#f3f2ee] border border-[#232835]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- MOBILE SWIPE CAROUSEL (Visible on mobile < md) --- */}
        <div className="block md:hidden">
          {filteredProjects.length > 0 && activeMobileProject && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#8c92a0]">
                <span className="flex items-center gap-1.5 font-semibold text-[#c5a880]">
                  <Layers className="w-3.5 h-3.5" /> Project {safeMobileIndex + 1} of {filteredProjects.length}
                </span>
              </div>

              {/* Touch & Drag Swipeable Card Wrapper */}
              <div className="cursor-grab active:cursor-grabbing select-none relative">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeMobileProject.id}
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
                    <ProjectCard project={activeMobileProject} basePath={`projects.${projects.indexOf(activeMobileProject)}`} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Bar - Dots Only */}
              <div className="flex items-center justify-center bg-[#131720] border border-[#232835] rounded-sm p-3 mt-4">
                <div className="flex items-center gap-2">
                  {filteredProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > safeMobileIndex ? 1 : -1);
                        setMobileProjectIndex(idx);
                      }}
                      aria-label={`Go to project ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        safeMobileIndex === idx ? 'w-7 bg-[#c5a880]' : 'w-2.5 bg-[#2c3344] hover:bg-[#8c92a0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- DESKTOP GRID (Visible on md+ screens) --- */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const idx = projects.indexOf(project);
            return (
              <EditableBlock key={project.id} path={`projects.${idx}`} label={project.title}>
                <ProjectCard project={project} basePath={`projects.${idx}`} />
              </EditableBlock>
            );
          })}
        </div>

      </div>
    </section>
  );
};


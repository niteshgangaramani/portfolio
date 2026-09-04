import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { ImagePlaceholder } from './ImagePlaceholder';
import { AboutData } from '../types';
import { GraduationCap, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText, EditableBlock } from '../admin/Editable';

interface AboutSectionProps {
  about: AboutData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  return (
    <section id="about" className="py-16 sm:py-28 bg-[#0d0f12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={about.eyebrow}
          title={about.sectionHeading}
          subtitle="An executive profile rooted in engineering rigor, strategic capital allocation, and a passion for creating enduring urban assets."
          editPaths={{ eyebrow: 'about.eyebrow', title: 'about.sectionHeading' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Image & Academic Qualifications */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6 sm:gap-8"
          >
            <div className="relative">
              <div className="bg-[#14171f] p-3 rounded-sm border border-[#2a303f] shadow-2xl">
                <ImagePlaceholder
                  src={about.image}
                  alt="Nitesh M. Gangaramani - Biography Portrait"
                  title="Nitesh M. Gangaramani"
                  category="Managing Director"
                  iconType="user"
                  aspectRatio="aspect-[4/5]"
                  fit="cover"
                  objectPosition="top"
                  className="rounded-xs"
                  showImageOverlay={false}
                  editPaths={{ src: 'about.image' }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-[#1a1e28] border border-[#c5a880]/40 p-3 sm:p-4 rounded-sm shadow-xl max-w-[200px] sm:max-w-[240px]"
              >
                <p className="text-[11px] sm:text-xs font-serif-title italic text-[#c5a880]">
                  "Execution is taking absolute ownership of entrusted projects."
                </p>
              </motion.div>
            </div>

            {/* Qualifications Card */}
            <div className="bg-[#14171f] p-5 sm:p-6 rounded-sm border border-[#232835] shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#232835]">
                <GraduationCap className="w-5 h-5 text-[#c5a880]" />
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#f3f2ee] font-semibold">
                  Academic Credentials
                </h3>
              </div>
              <div className="space-y-3.5">
                {about.qualifications.map((qual, idx) => (
                  <EditableBlock key={idx} path={`about.qualifications.${idx}`} label={qual.degree}>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans-body font-semibold text-[#f3f2ee]">
                          <EditableText path={`about.qualifications.${idx}.degree`}>{qual.degree}</EditableText>
                        </span>
                        {qual.badge && (
                          <span className="text-[10px] font-mono text-[#c5a880] px-2 py-0.5 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-xs font-semibold">
                            <EditableText path={`about.qualifications.${idx}.badge`}>{qual.badge}</EditableText>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8c92a0]">
                        <EditableText path={`about.qualifications.${idx}.institution`}>{qual.institution}</EditableText>
                      </span>
                    </div>
                  </EditableBlock>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Biography & Personal Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6 sm:gap-8"
          >
            
            {/* Quote banner */}
            <div className="bg-gradient-to-r from-[#171b24] to-[#13161d] p-5 sm:p-6 rounded-sm border-l-4 border-[#c5a880] shadow-md relative">
              <Quote className="w-8 h-8 text-[#c5a880]/20 absolute top-4 right-4 pointer-events-none" />
              <p className="text-sm sm:text-lg font-serif-title italic text-[#e8e6e1] leading-relaxed">
                "<EditableText path="about.quote" as="span">{about.quote}</EditableText>"
              </p>
            </div>

            {/* Main Biography Text (Collapsible on Mobile) */}
            <div>
              <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#a2a8b8] font-sans-body font-light leading-relaxed space-y-4">
                {/* On mobile, show only paragraph 1 if collapsed */}
                {about.bioParagraphs.map((para, idx) => {
                  if (idx > 0 && !isBioExpanded) {
                    return (
                      <p key={idx} className="hidden md:block">
                        <EditableText path={`about.bioParagraphs.${idx}`} as="span">{para}</EditableText>
                      </p>
                    );
                  }
                  return (
                    <p key={idx} className="first-letter:text-2xl first-letter:font-serif-title first-letter:text-[#c5a880] first-letter:font-bold">
                      <EditableText path={`about.bioParagraphs.${idx}`} as="span">{para}</EditableText>
                    </p>
                  );
                })}
              </div>

              {/* Mobile Expansion Toggle */}
              <button
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="mt-3 md:hidden inline-flex items-center gap-1.5 text-xs font-mono text-[#c5a880] underline underline-offset-4 py-1"
              >
                <span>{isBioExpanded ? 'Show Less Biography' : 'Read Full Executive Bio'}</span>
                {isBioExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Work-Life Balance & Personal Lifestyle Section */}
            <div className="pt-6 border-t border-[#232835]">
              <h3 className="text-base sm:text-lg font-serif-title text-[#f3f2ee] mb-3">
                Beyond the Boardroom & Construction Sites
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-[#a2a8b8] font-sans-body font-light leading-relaxed mb-6">
                {about.lifestyleParagraph.map((p, idx) => (
                  <p key={idx}>
                    <EditableText path={`about.lifestyleParagraph.${idx}`} as="span">{p}</EditableText>
                  </p>
                ))}
              </div>

              {/* Personal Highlight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {about.personalHighlights.map((item, idx) => (
                  <EditableBlock key={idx} path={`about.personalHighlights.${idx}`} label={item.title}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-[#14171f] p-3 sm:p-3.5 rounded-sm border border-[#232835] flex flex-col gap-1 hover:border-[#c5a880]/40 transition-colors h-full"
                    >
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#c5a880]">
                        <EditableText path={`about.personalHighlights.${idx}.title`}>{item.title}</EditableText>
                      </span>
                      <span className="text-xs font-sans-body text-[#e8e6e1] font-medium leading-tight">
                        <EditableText path={`about.personalHighlights.${idx}.detail`} as="span">{item.detail}</EditableText>
                      </span>
                    </motion.div>
                  </EditableBlock>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};



import React from 'react';
import { motion } from 'motion/react';
import { EditableText } from '../admin/Editable';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  editPaths?: { eyebrow?: string; title?: string; subtitle?: string };
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className = '',
  editPaths,
}) => {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  const EyebrowTag = editPaths?.eyebrow ? (
    <EditableText path={editPaths.eyebrow} className="">
      {eyebrow}
    </EditableText>
  ) : (
    <span>{eyebrow}</span>
  );

  const TitleTag = editPaths?.title ? (
    <EditableText path={editPaths.title} as="span" className="">
      {title}
    </EditableText>
  ) : (
    title
  );

  const SubtitleTag = subtitle && editPaths?.subtitle ? (
    <EditableText path={editPaths.subtitle} as="span" className="">
      {subtitle}
    </EditableText>
  ) : (
    subtitle
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${alignmentClass} max-w-3xl mb-12 sm:mb-16 ${className}`}
    >
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[1px] bg-[#c5a880]"
          />
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#c5a880] font-semibold">
            {EyebrowTag}
          </span>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-title font-normal tracking-tight text-[#f3f2ee] leading-[1.15]">
        {TitleTag}
      </h2>

      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-[#9fa4b0] font-sans-body font-light leading-relaxed max-w-2xl">
          {SubtitleTag}
        </p>
      )}
    </motion.div>
  );
};

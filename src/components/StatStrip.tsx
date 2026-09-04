import React from 'react';
import { StatItem } from '../types';
import { motion } from 'motion/react';
import { EditableText, EditableBlock } from '../admin/Editable';

interface StatStripProps {
  stats: StatItem[];
}

export const StatStrip: React.FC<StatStripProps> = ({ stats }) => {
  return (
    <section className="relative z-20 bg-[#12151b] border-y border-[#232834] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#232834]"
        >
          {stats.map((stat, idx) => (
            <EditableBlock key={stat.id} path={`stats.${idx}`} label={stat.label} className={`${idx > 0 ? 'pt-6 lg:pt-4' : ''}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center p-4 transition-all duration-300"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif-title font-bold text-[#c5a880] tracking-tight mb-2 drop-shadow-sm">
                  <EditableText path={`stats.${idx}.value`}>{stat.value}</EditableText>
                </span>
                <span className="text-xs sm:text-sm font-sans-body font-semibold text-[#f3f2ee] tracking-wide uppercase mb-1">
                  <EditableText path={`stats.${idx}.label`}>{stat.label}</EditableText>
                </span>
                <p className="text-xs text-[#8c92a0] font-sans-body font-light max-w-[200px]">
                  <EditableText path={`stats.${idx}.description`} as="span">{stat.description}</EditableText>
                </p>
              </motion.div>
            </EditableBlock>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

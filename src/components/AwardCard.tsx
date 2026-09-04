import React from 'react';
import { AwardData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Award } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText } from '../admin/Editable';

interface AwardCardProps {
  award: AwardData;
  basePath: string;
}

export const AwardCard: React.FC<AwardCardProps> = ({ award, basePath }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="bg-[#14171f] rounded-sm border border-[#232835] hover:border-[#c5a880]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#c5a880]/10 overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        <ImagePlaceholder
          src={award.image}
          alt={award.title}
          title={award.title}
          category={award.organization}
          iconType="award"
          aspectRatio="aspect-[4/3]"
          fit="contain"
          editPaths={{
            src: `${basePath}.image`,
            title: `${basePath}.title`,
            category: `${basePath}.organization`,
          }}
        />

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#c5a880] uppercase tracking-wider">
              <EditableText path={`${basePath}.organization`}>{award.organization}</EditableText>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-[#1e232e] text-[#8c92a0] border border-[#2c3344] rounded-xs font-semibold">
              <EditableText path={`${basePath}.year`}>{award.year}</EditableText>
            </span>
          </div>

          <h3 className="text-xl font-serif-title font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors leading-snug">
            <EditableText path={`${basePath}.title`}>{award.title}</EditableText>
          </h3>

          <p className="text-xs sm:text-sm text-[#a2a8b8] font-sans-body font-light leading-relaxed">
            <EditableText path={`${basePath}.description`} as="span">{award.description}</EditableText>
          </p>
        </div>
      </div>

      <div className="px-6 py-3 bg-[#101218] border-t border-[#202532] flex items-center justify-between text-[11px] font-mono text-[#8c92a0]">
        <div className="flex items-center gap-1.5 text-[#c5a880]">
          <Award className="w-3.5 h-3.5" />
          <span>Industry Recognition</span>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { JourneyItemData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText, EditableArrayField } from '../admin/Editable';

interface JourneyItemProps {
  item: JourneyItemData;
  index: number;
  isEven: boolean;
  basePath: string;
}

export const JourneyItem: React.FC<JourneyItemProps> = ({ item, isEven, basePath }) => {
  return (
    <div className="relative mb-12 lg:mb-20 last:mb-0">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#181c24] border-2 border-[#c5a880] items-center justify-center z-20 shadow-lg shadow-[#c5a880]/30"
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2.5 h-2.5 rounded-full bg-[#c5a880]"
        />
      </motion.div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:direction-rtl'}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-6 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left lg:order-2'}`}
        >
          <div className="bg-[#14171f] p-6 sm:p-8 rounded-sm border border-[#232835] hover:border-[#c5a880]/60 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-[#c5a880]/10">
            <div className={`flex flex-wrap items-center gap-3 mb-4 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <span className="text-xl sm:text-2xl font-serif-title font-bold text-[#c5a880] px-3 py-1 bg-[#1c212c] border border-[#c5a880]/30 rounded-xs">
                <EditableText path={`${basePath}.year`}>{item.year}</EditableText>
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-[#8c92a0] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <EditableText path={`${basePath}.location`}>{item.location}</EditableText>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif-title font-normal text-[#f3f2ee] mb-3 group-hover:text-[#c5a880] transition-colors">
              <EditableText path={`${basePath}.title`}>{item.title}</EditableText>
            </h3>

            <p className="text-xs sm:text-sm text-[#a2a8b8] font-sans-body font-light leading-relaxed mb-5">
              <EditableText path={`${basePath}.description`} as="span">{item.description}</EditableText>
            </p>

            {item.highlights && item.highlights.length > 0 && (
              <EditableArrayField
                path={`${basePath}.highlights`}
                className={`pt-4 border-t border-[#202532] flex flex-col gap-2 ${isEven ? 'lg:items-end' : 'lg:items-start'}`}
                label="Edit highlights"
              >
                {item.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#c5a880]/90 font-sans-body">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </EditableArrayField>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-6 ${isEven ? 'lg:pl-12' : 'lg:pr-12 lg:order-1'}`}
        >
          <div className="relative bg-[#14171f] p-2 rounded-sm border border-[#232835] shadow-xl overflow-hidden group">
            <ImagePlaceholder
              src={item.image}
              alt={`${item.year} - ${item.title}`}
              title={item.title}
              category={item.location}
              iconType="building"
              aspectRatio="aspect-[4/3]"
              fit="contain"
              className="rounded-xs"
              editPaths={{
                src: `${basePath}.image`,
                title: `${basePath}.title`,
                category: `${basePath}.location`,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

import React from 'react';
import { PhilosophyItem } from '../types';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Briefcase,
  Users,
  CheckCircle2,
  HardHat,
  Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText } from '../admin/Editable';

interface PhilosophyCardProps {
  item: PhilosophyItem;
  basePath: string;
}

export const PhilosophyCard: React.FC<PhilosophyCardProps> = ({ item, basePath }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#c5a880]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#c5a880]" />;
      case 'Award': return <Award className="w-6 h-6 text-[#c5a880]" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-[#c5a880]" />;
      case 'Users': return <Users className="w-6 h-6 text-[#c5a880]" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-[#c5a880]" />;
      case 'HardHat': return <HardHat className="w-6 h-6 text-[#c5a880]" />;
      case 'Leaf': return <Leaf className="w-6 h-6 text-[#c5a880]" />;
      default: return <ShieldCheck className="w-6 h-6 text-[#c5a880]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="bg-[#14171f] p-6 sm:p-8 rounded-sm border border-[#232835] hover:border-[#c5a880]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#c5a880]/10 flex flex-col justify-between group h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a880]/5 rounded-bl-full pointer-events-none group-hover:bg-[#c5a880]/10 transition-colors" />

      <div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="p-3 bg-[#1c212c] rounded-sm border border-[#c5a880]/30 group-hover:border-[#c5a880] transition-colors shadow-inner">
            {getIcon(item.iconName)}
          </div>
          <EditableText path={`${basePath}.number`} className="text-2xl font-serif-title font-bold text-[#c5a880]/40 font-mono">
            0{item.number}
          </EditableText>
        </div>

        <h3 className="text-xl font-serif-title font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors mb-3">
          <EditableText path={`${basePath}.title`}>{item.title}</EditableText>
        </h3>

        <p className="text-xs sm:text-sm text-[#a2a8b8] font-sans-body font-light leading-relaxed">
          <EditableText path={`${basePath}.description`} as="span">{item.description}</EditableText>
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#202532] flex items-center gap-1.5 text-[10px] font-mono text-[#8c92a0] uppercase tracking-wider relative z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
        <span>Leadership Pillar 0{item.number}</span>
      </div>
    </motion.div>
  );
};

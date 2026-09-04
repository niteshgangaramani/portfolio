import React from 'react';
import { ProjectData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText, EditableArrayField } from '../admin/Editable';

interface ProjectCardProps {
  project: ProjectData;
  basePath: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, basePath }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#14171f] rounded-sm border border-[#232835] hover:border-[#c5a880]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#c5a880]/10 overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        <div className="relative overflow-hidden">
          <ImagePlaceholder
            src={project.image}
            alt={project.title}
            title={project.title}
            category={project.category}
            iconType="building"
            aspectRatio="aspect-[4/3]"
            fit="contain"
            editPaths={{
              src: `${basePath}.image`,
              title: `${basePath}.title`,
              category: `${basePath}.category`,
            }}
          />

          {project.value && (
            <div className="absolute top-4 right-4 bg-[#0d0f12]/90 backdrop-blur-md px-3 py-1 rounded-xs border border-[#c5a880]/40 text-xs font-mono font-bold text-[#c5a880] shadow-md">
              <EditableText path={`${basePath}.value`}>{project.value}</EditableText>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#c5a880] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <EditableText path={`${basePath}.location`}>{project.location}</EditableText>
          </div>

          <h3 className="text-xl font-serif-title font-semibold text-[#f3f2ee] group-hover:text-[#c5a880] transition-colors leading-snug">
            <EditableText path={`${basePath}.title`}>{project.title}</EditableText>
          </h3>

          <p className="text-xs sm:text-sm text-[#a2a8b8] font-sans-body font-light leading-relaxed">
            <EditableText path={`${basePath}.description`} as="span">{project.description}</EditableText>
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <EditableArrayField path={`${basePath}.highlights`} className="pt-3 border-t border-[#202532] space-y-2" label="Edit highlights">
              {project.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#9fa4b0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </EditableArrayField>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-[#101218] border-t border-[#202532] flex items-center justify-between text-[11px] font-mono text-[#8c92a0]">
        <span>Category</span>
        <EditableText path={`${basePath}.category`} className="text-[#c5a880] font-medium">
          {project.category}
        </EditableText>
      </div>
    </motion.div>
  );
};

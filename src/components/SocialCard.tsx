import React from 'react';
import { SocialPostData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Linkedin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText, EditableLink } from '../admin/Editable';

interface SocialCardProps {
  post: SocialPostData;
  basePath: string;
}

export const SocialCard: React.FC<SocialCardProps> = ({ post, basePath }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-[#14171f] rounded-sm border border-[#232835] hover:border-[#0077b5]/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#0077b5]/10 overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        <ImagePlaceholder
          src={post.image}
          alt={post.title}
          title={post.title}
          category={post.platform}
          iconType="news"
          aspectRatio="aspect-[4/3]"
          fit="contain"
          editPaths={{
            src: `${basePath}.image`,
            title: `${basePath}.title`,
            category: `${basePath}.platform`,
          }}
        />

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-mono text-[#0077b5] font-semibold">
              <Linkedin className="w-3.5 h-3.5" />
              <EditableText path={`${basePath}.platform`}>{post.platform}</EditableText>
              <span> Insight</span>
            </div>
            {post.date && (
              <span className="font-mono text-[#8c92a0]">
                <EditableText path={`${basePath}.date`}>{post.date}</EditableText>
              </span>
            )}
          </div>

          <h3 className="text-base font-serif-title font-semibold text-[#f3f2ee] group-hover:text-[#0077b5] transition-colors leading-snug line-clamp-2">
            <EditableText path={`${basePath}.title`}>{post.title}</EditableText>
          </h3>

          <p className="text-xs text-[#a2a8b8] font-sans-body font-light leading-relaxed line-clamp-2">
            <EditableText path={`${basePath}.description`} as="span">{post.description}</EditableText>
          </p>

          {post.tags && (
            <div className="flex flex-wrap gap-1 pt-1">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-mono text-[#8c92a0] px-1.5 py-0.5 bg-[#1a1e27] rounded-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2.5 bg-[#101218] border-t border-[#202532] flex items-center justify-between text-xs font-mono">
        <span className="text-[#8c92a0] text-[11px]">Social Link</span>
        <EditableLink path={`${basePath}.url`} href={post.url} className="inline-flex items-center gap-1 text-[#0077b5] hover:text-[#38a0dc] transition-colors font-medium text-[11px]">
          <span>View Post</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </EditableLink>
      </div>
    </motion.div>
  );
};



import React, { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { SocialCard } from './SocialCard';
import { VideoCard } from './VideoCard';
import { SocialPostData, VideoItemData, SectionHeadingOverride } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { EditableBlock } from '../admin/Editable';

interface SocialSectionProps {
  posts: SocialPostData[];
  videos: VideoItemData[];
  heading?: SectionHeadingOverride;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ posts, videos, heading }) => {
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const activePost = posts[activePostIndex];
  const activeVideo = videos[activeVideoIndex];

  const handlePostPrev = () => {
    setActivePostIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const handlePostNext = () => {
    setActivePostIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  const handleVideoPrev = () => {
    setActiveVideoIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleVideoNext = () => {
    setActiveVideoIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  // Drag handlers for 1 card swipe
  const handlePostDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -30 || info.velocity.x < -300) {
      handlePostNext();
    } else if (info.offset.x > 30 || info.velocity.x > 300) {
      handlePostPrev();
    }
  };

  const handleVideoDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -30 || info.velocity.x < -300) {
      handleVideoNext();
    } else if (info.offset.x > 30 || info.velocity.x > 300) {
      handleVideoPrev();
    }
  };

  return (
    <section id="insights" className="py-16 sm:py-28 bg-[#0a0c0f] relative overflow-hidden border-t border-[#1e232e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'THOUGHT LEADERSHIP & FIELD VISITS'}
          title={heading?.title ?? 'Perspectives & Ground Realities'}
          subtitle={heading?.subtitle ?? 'Regular insights on urban planning, real estate investment trends, construction technology, and behind-the-scenes site walkthroughs.'}
          align="center"
          editPaths={{
            eyebrow: 'settings.headings.insights.eyebrow',
            title: 'settings.headings.insights.title',
            subtitle: 'settings.headings.insights.subtitle',
          }}
        />

        {/* Subsection 1: Latest Insights (LinkedIn) */}
        <div className="mb-14 sm:mb-16">
          <div className="flex items-center justify-between pb-3 border-b border-[#202532] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0077b5]" />
              <h3 className="text-lg sm:text-xl font-serif-title font-semibold text-[#f3f2ee]">
                Strategic Insights (LinkedIn)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8c92a0] md:hidden">
              {activePostIndex + 1} / {posts.length}
            </span>
          </div>

          {/* MOBILE CAROUSEL FOR LINKEDIN POSTS WITH 1-CARD DRAG SWIPE */}
          <div className="block md:hidden">
            <div className="cursor-grab active:cursor-grabbing select-none relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePost.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handlePostDragEnd}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <SocialCard post={activePost} basePath={`socialPosts.${activePostIndex}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots Only */}
            <div className="flex items-center justify-center pt-4 mt-3 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {posts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-edit-allow
                    onClick={() => setActivePostIndex(i)}
                    aria-label={`Go to post ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activePostIndex === i ? 'w-7 bg-[#0077b5]' : 'w-2.5 bg-[#2a3040] hover:bg-[#8c92a0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden md:grid md:grid-cols-2 gap-8">
            {posts.map((post, idx) => (
              <EditableBlock key={post.id} path={`socialPosts.${idx}`} label={post.title}>
                <SocialCard post={post} basePath={`socialPosts.${idx}`} />
              </EditableBlock>
            ))}
          </div>
        </div>

        {/* Subsection 2: On The Ground (YouTube) */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#202532] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff0000]" />
              <h3 className="text-lg sm:text-xl font-serif-title font-semibold text-[#f3f2ee]">
                On The Ground (Site Visits & Keynotes)
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8c92a0] md:hidden">
              {activeVideoIndex + 1} / {videos.length}
            </span>
          </div>

          {/* MOBILE CAROUSEL FOR VIDEOS WITH 1-CARD DRAG SWIPE */}
          <div className="block md:hidden">
            <div className="cursor-grab active:cursor-grabbing select-none relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVideo.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleVideoDragEnd}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <VideoCard video={activeVideo} basePath={`videos.${activeVideoIndex}`} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots Only */}
            <div className="flex items-center justify-center pt-4 mt-3 border-t border-[#232835]">
              <div className="flex items-center gap-2">
                {videos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    data-edit-allow
                    onClick={() => setActiveVideoIndex(i)}
                    aria-label={`Go to video ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeVideoIndex === i ? 'w-7 bg-[#ff0000]' : 'w-2.5 bg-[#2a3040] hover:bg-[#8c92a0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <EditableBlock key={video.id} path={`videos.${idx}`} label={video.title}>
                <VideoCard video={video} basePath={`videos.${idx}`} />
              </EditableBlock>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};



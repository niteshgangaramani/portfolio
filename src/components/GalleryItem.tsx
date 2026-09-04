import React from 'react';
import { GalleryItemData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useIsEditMode } from '../admin/EditModeGuard';

interface GalleryItemProps {
  item: GalleryItemData;
  basePath: string;
  onClick: () => void;
  compact?: boolean;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ item, basePath, onClick, compact = false }) => {
  const isEditMode = useIsEditMode();

  if (compact) {
    return (
      <div onClick={onClick} className="w-full cursor-pointer">
        <ImagePlaceholder
          src={item.src}
          alt={item.caption}
          title={item.caption}
          category={item.category}
          iconType="gallery"
          aspectRatio="aspect-square"
          fit="cover"
          editPaths={{
            src: `${basePath}.src`,
            title: `${basePath}.caption`,
            category: `${basePath}.category`,
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      whileHover={{ y: isEditMode ? 0 : -6 }}
      transition={{ duration: 0.35 }}
      onClick={() => {
        if (isEditMode) return;
        onClick();
      }}
      className={`group relative bg-[#14171f] rounded-sm border border-[#232835] hover:border-[#c5a880] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#c5a880]/15 ${isEditMode ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <ImagePlaceholder
        src={item.src}
        alt={item.caption}
        title={item.caption}
        category={item.category}
        iconType="gallery"
        aspectRatio={item.aspectRatio || 'aspect-[4/3]'}
        fit="contain"
        editPaths={{
          src: `${basePath}.src`,
          title: `${basePath}.caption`,
          category: `${basePath}.category`,
        }}
      />

      {!isEditMode && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="p-2 bg-[#1a1e28] text-[#c5a880] rounded-full border border-[#c5a880]/40 group-hover:scale-110 transition-transform">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

import React from 'react';
import { GalleryItemData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
  item: GalleryItemData | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  item,
  onClose,
  onNext,
  onPrev
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-[#1c212c] text-[#f3f2ee] border border-[#383f52] hover:bg-[#c5a880] hover:text-[#0d0f12] transition-colors z-50"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1c212c]/80 text-[#f3f2ee] border border-[#383f52] hover:bg-[#c5a880] hover:text-[#0d0f12] transition-colors z-50 hidden sm:flex"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1c212c]/80 text-[#f3f2ee] border border-[#383f52] hover:bg-[#c5a880] hover:text-[#0d0f12] transition-colors z-50 hidden sm:flex"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Main Content Container */}
      <div className="max-w-4xl w-full bg-[#14171f] border border-[#2a303f] rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        <div className="relative w-full overflow-hidden rounded-xs bg-black">
          <ImagePlaceholder
            src={item.src}
            alt={item.caption}
            title={item.caption}
            category={item.category}
            iconType="gallery"
            aspectRatio="aspect-[16/10]"
            fit="contain"
          />
        </div>

        {/* Caption & Metadata */}
        <div className="pt-3 border-t border-[#232835] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#c5a880] uppercase tracking-wider">
              {item.category}
            </span>
            <span className="text-[10px] font-mono text-[#8c92a0]">
              Visual Gallery Item
            </span>
          </div>

          <p className="text-base sm:text-lg font-serif-title font-medium text-[#f3f2ee] leading-relaxed">
            {item.caption}
          </p>
        </div>

      </div>

    </div>
  );
};

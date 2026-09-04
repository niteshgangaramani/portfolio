import React, { useRef, useState } from 'react';
import { VideoItemData } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Play, Youtube, Clock, X, ImageIcon, Film } from 'lucide-react';
import { EditableText, EditableLink } from '../admin/Editable';
import { useIsEditMode } from '../admin/EditModeGuard';
import { useAdminOptional } from '../admin/AdminContext';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

interface VideoCardProps {
  video: VideoItemData;
  basePath: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, basePath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isEditMode = useIsEditMode();
  const admin = useAdminOptional();
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
  const hasLocalVideo = Boolean(video.videoUrl);
  const hasPlayableVideo = Boolean(embedUrl || hasLocalVideo);

  const uploadThumbnail = async (file: File) => {
    if (!admin) return;
    admin.updateField(`${basePath}.thumbnail`, await readFileAsDataUrl(file));
    admin.selectPath(`${basePath}.thumbnail`);
    admin.setPanelTab('edit');
  };

  const uploadVideoFile = async (file: File) => {
    if (!admin) return;
    admin.updateField(`${basePath}.videoUrl`, await readFileAsDataUrl(file));
    admin.selectPath(`${basePath}.videoUrl`);
    admin.setPanelTab('edit');
  };

  return (
    <div className="bg-[#14171f] rounded-sm border border-[#232835] hover:border-[#ff0000]/50 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden flex flex-col justify-between group h-full">
      <div>
        <div
          className="relative"
          onClick={(e) => isEditMode && e.stopPropagation()}
        >
          {isPlaying && !isEditMode && hasPlayableVideo ? (
            <div className="relative aspect-video w-full bg-black">
              {hasLocalVideo ? (
                <video
                  src={video.videoUrl}
                  title={video.title}
                  className="w-full h-full border-0"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <iframe
                  src={embedUrl!}
                  title={video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                aria-label="Close video"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className={`relative ${!isEditMode && hasPlayableVideo ? 'cursor-pointer group/thumb' : ''}`}
              onClick={() => {
                if (isEditMode) return;
                if (hasPlayableVideo) setIsPlaying(true);
              }}
            >
              <ImagePlaceholder
                src={video.thumbnail}
                alt={video.title}
                title={video.title}
                category="Site Visit / Keynote"
                iconType="video"
                aspectRatio="aspect-video"
                fit="contain"
                replaceLabel="Change Thumbnail"
                editPaths={{
                  src: `${basePath}.thumbnail`,
                  title: `${basePath}.title`,
                }}
              />

              {isEditMode && (
                <div className="absolute top-2 left-2 z-30 flex flex-col gap-1.5">
                  <button
                    type="button"
                    data-edit-path={`${basePath}.thumbnail`}
                    onClick={(e) => {
                      e.stopPropagation();
                      thumbInputRef.current?.click();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#0d0f12]/95 border border-[var(--admin-accent,#c5a880)] text-[var(--admin-accent,#c5a880)] text-[10px] font-mono font-bold shadow-lg hover:bg-[var(--admin-accent,#c5a880)] hover:text-[#0d0f12] transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Change Thumbnail
                  </button>
                  <button
                    type="button"
                    data-edit-path={`${basePath}.videoUrl`}
                    onClick={(e) => {
                      e.stopPropagation();
                      videoInputRef.current?.click();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#0d0f12]/95 border border-[#ff0000]/60 text-[#ff6b6b] text-[10px] font-mono font-bold shadow-lg hover:bg-[#ff0000] hover:text-white transition-colors"
                  >
                    <Film className="w-3 h-3" />
                    Upload Video
                  </button>
                  <input
                    ref={thumbInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadThumbnail(f);
                    }}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadVideoFile(f);
                    }}
                  />
                </div>
              )}

              {!isEditMode && hasPlayableVideo && (
                <div className="absolute inset-0 bg-black/40 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center pointer-events-none z-10">
                  <div className="w-10 h-10 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  </div>
                </div>
              )}

              {video.duration && (
                <div className={`absolute bottom-2.5 z-20 bg-[#0d0f12]/90 px-2 py-0.5 rounded-xs text-[10px] font-mono text-[#f3f2ee] flex items-center gap-1 border border-[#2c3344] ${isEditMode ? 'right-2.5 pointer-events-auto' : 'right-2.5 pointer-events-none'}`}>
                  <Clock className="w-2.5 h-2.5 text-[#ff0000]" />
                  <EditableText path={`${basePath}.duration`}>{video.duration}</EditableText>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#ff0000] font-semibold">
            <Youtube className="w-3.5 h-3.5" />
            <span>Site Visit / Keynote</span>
          </div>

          <h3 className="text-base font-serif-title font-semibold text-[#f3f2ee] group-hover:text-[#ff0000] transition-colors leading-snug line-clamp-2">
            <EditableText path={`${basePath}.title`}>{video.title}</EditableText>
          </h3>

          <p className="text-xs text-[#a2a8b8] font-sans-body font-light leading-relaxed line-clamp-2">
            <EditableText path={`${basePath}.description`} as="span">{video.description}</EditableText>
          </p>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-[#101218] border-t border-[#202532] space-y-2 text-[11px] font-mono text-[#8c92a0]">
        {video.videoUrl && (
          <div className="flex items-center justify-between gap-2">
            <span>Local Video</span>
            <EditableLink
              path={`${basePath}.videoUrl`}
              href={video.videoUrl}
              external={false}
              className="text-[#ff0000] font-medium truncate max-w-[60%]"
            >
              {video.videoUrl.startsWith('data:') ? 'Uploaded video file' : video.videoUrl}
            </EditableLink>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span>{video.youtubeUrl ? 'YouTube URL' : video.videoUrl ? 'Add YouTube' : 'Video URL'}</span>
          <EditableLink
            path={`${basePath}.youtubeUrl`}
            href={video.youtubeUrl || '#'}
            className="text-[#ff0000] font-medium truncate max-w-[60%]"
          >
            {video.youtubeUrl || 'Add YouTube URL'}
          </EditableLink>
        </div>
        {isEditMode && !video.videoUrl && (
          <button
            type="button"
            data-edit-path={`${basePath}.videoUrl`}
            onClick={(e) => {
              e.stopPropagation();
              videoInputRef.current?.click();
            }}
            className="w-full mt-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-xs border border-dashed border-[#ff0000]/40 text-[#ff6b6b] text-[10px] font-mono hover:border-[#ff0000] hover:bg-[#ff0000]/10 transition-colors"
          >
            <Film className="w-3 h-3" />
            Upload .mp4 video file
          </button>
        )}
      </div>
    </div>
  );
};

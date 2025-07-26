import { Button } from '@/components/ui/button';
import type { Video } from '@/types';

type VideoCardProps = {
  video: Video;
  showWatchNow?: boolean;
  className?: string;
};

export const VideoCard = ({
  video,
  showWatchNow = false,
  className = '',
}: VideoCardProps) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${className}`}>
      <div className="relative flex-shrink-0">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-40 h-24 object-cover rounded-md"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{video.owner.username}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
        
        {showWatchNow && (
          <div className="mt-2">
            <Button variant="outline" size="sm" className="text-xs h-7">
              Watch Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

import { Link } from "react-router-dom";
import numeral from "numeral";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  userId: string;
  categoryId: string;
  createdAt: string;
}

const VideoCard = ({ video }: { video: Video }) => {
  const formatViews = (views: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(views);
  };

  const createdAt = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });
  
  return (
    <div className="group cursor-pointer">
      <Link to={`/video/${video.id}`} className="block">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-black rounded-[5px] overflow-hidden mb-3">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Duration overlay - you can add duration field to your data */}
          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded text-[10px] font-medium">
            12:34
          </div>
        </div>

        {/* Video Info */}
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${video.userId}`} />
            <AvatarFallback className="text-xs font-medium">
              {video.userId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-1">
              {video.userId}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{createdAt}</span>
            </div>
          </div>

          {/* More options button */}
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;

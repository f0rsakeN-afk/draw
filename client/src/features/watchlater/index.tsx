import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Video } from '@/types';
import { VideoCard } from '@/components/video';

// Dummy data for testing
const dummyVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React',
    duration: 1200,
    thumbnail: 'https://via.placeholder.com/320x180',
    views: 1000,
    isPublished: true,
    owner: { id: '1', username: 'user1', avatar: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Learn advanced TypeScript patterns and techniques',
    duration: 1800,
    thumbnail: 'https://via.placeholder.com/320x180',
    views: 500,
    isPublished: true,
    owner: { id: '2', username: 'typescript_expert', avatar: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Building Scalable APIs with Node.js',
    description: 'Learn how to build scalable and maintainable APIs',
    duration: 2400,
    thumbnail: 'https://via.placeholder.com/320x180',
    views: 750,
    isPublished: true,
    owner: { id: '3', username: 'node_master', avatar: null },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function WatchLaterPage() {
  const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>(dummyVideos);



  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Watch Later</h1>
        <p className="text-muted-foreground">Your saved videos to watch later</p>
      </div>

      <div className="border rounded-lg p-4">
        {watchLaterVideos.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-4">
              {watchLaterVideos.map((video) => (
                <div key={video.id} className="w-full">
                  <VideoCard
                    video={video}
                    showWatchNow={true}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-muted-foreground" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">Your watch later list is empty</h3>
            <p className="text-muted-foreground text-sm">
              Videos you save to watch later will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

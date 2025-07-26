import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  // Add more dummy videos as needed
];

const dummyPlaylists = [
  {
    id: '1',
    name: 'Web Development',
    description: 'Videos about web development',
    videos: dummyVideos,
    isPrivate: false,
    owner: { id: '1', username: 'user1' },
  },
  {
    id: '2',
    name: 'Tutorials',
    description: 'Helpful tutorials',
    videos: [],
    isPrivate: true,
    owner: { id: '1', username: 'user1' },
  },
];

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState(dummyPlaylists);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: '',
      videos: [],
      isPrivate: false,
      owner: { id: '1', username: 'user1' },
    };
    
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
    if (selectedPlaylist === playlistId) {
      setSelectedPlaylist(null);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Playlists</h1>
      
      <div className="flex gap-6">
        {/* Playlist List */}
        <div className="w-1/3">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
            />
            <Button onClick={createPlaylist}>Create</Button>
          </div>
          
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlaylist === playlist.id ? 'bg-accent' : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedPlaylist(playlist.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.videos.length} videos • {playlist.isPrivate ? 'Private' : 'Public'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Playlist Content */}
        <div className="flex-1">
          {selectedPlaylist ? (
            <PlaylistDetail 
              playlist={playlists.find(p => p.id === selectedPlaylist)!}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Select a playlist to view or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaylistDetail = ({
  playlist,
}: {
  playlist: typeof dummyPlaylists[0];
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{playlist.name}</h2>
        <p className="text-muted-foreground">{playlist.description || 'No description'}</p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {playlist.videos.length > 0 ? (
          <div className="space-y-4">
            {playlist.videos.map((video) => (
              <div key={video.id} className="w-full">
                <VideoCard
                  video={video}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No videos in this playlist yet. Add some videos to get started.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  views: number;
  isPublished: boolean;
  owner: User;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: Video[];
  isPrivate: boolean;
  owner: Pick<User, 'id' | 'username'>;
  createdAt?: string;
  updatedAt?: string;
}

export interface WatchLaterItem {
  id: string;
  userId: string;
  video: Video;
  createdAt: string;
  updatedAt: string;
}

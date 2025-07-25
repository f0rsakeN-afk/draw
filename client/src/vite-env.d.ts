/// <reference types="vite/client" />
type Video = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  userId: string;
  categoryId: string;
  createdAt: string; // ISO string format
};

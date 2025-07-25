import prisma from '../lib/prisma';
import { AppError } from '../utils/AppError';

export const createPlaylist = async (userId: string, name: string, description?: string, isPublic: boolean = true) => {
  return prisma.playList.create({
    data: {
      name,
      description,
      isPublic,
      userId,
    },
  });
};

export const getUserPlaylists = async (userId: string) => {
  return prisma.playList.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          videos: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

export const getPlaylistById = async (playlistId: string, userId?: string) => {
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
    include: {
      user: {
        select: {
          id: true,
          name: true
        },
      },
      videos: {
        include: {
          video: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                },
              },
              _count: {
                select: {
                  likes: {
                    where: { type: 'LIKE' },
                  },
                  comments: true,
                },
              },
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  // Check if playlist is private and user is not the owner
  if (!playlist.isPublic && playlist.userId !== userId) {
    throw new AppError('Not authorized to view this playlist', 403);
  }

  return playlist;
};

export const updatePlaylist = async (
  playlistId: string,
  userId: string,
  data: { name?: string; description?: string; isPublic?: boolean }
) => {
  // Check if playlist exists and user is the owner
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Not authorized to update this playlist', 403);
  }

  return prisma.playList.update({
    where: { id: playlistId },
    data: {
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
    },
  });
};

export const deletePlaylist = async (playlistId: string, userId: string) => {
  // Check if playlist exists and user is the owner
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Not authorized to delete this playlist', 403);
  }

  // Delete playlist (cascading delete will handle PlayListVideos)
  await prisma.playList.delete({
    where: { id: playlistId },
  });
};

export const addVideoToPlaylist = async (playlistId: string, videoId: string, userId: string) => {
  // Check if playlist exists and user is the owner
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Not authorized to modify this playlist', 403);
  }

  // Check if video exists
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new AppError('Video not found', 404);
  }

  // Check if video is already in playlist
  const existing = await prisma.playListVideos.findUnique({
    where: {
      playlistId_videoId: {
        playlistId,
        videoId,
      },
    },
  });

  if (existing) {
    throw new AppError('Video already in playlist', 400);
  }

  // Get the count of videos in the playlist to set position
  const count = await prisma.playListVideos.count({
    where: { playlistId },
  });

  // Add video to playlist
  return prisma.playListVideos.create({
    data: {
      playlistId,
      videoId,
      position: count, // 0-based position
    },
  });
};

export const removeVideoFromPlaylist = async (playlistId: string, videoId: string, userId: string) => {
  // Check if playlist exists and user is the owner
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Not authorized to modify this playlist', 403);
  }

  // Remove video from playlist
  await prisma.playListVideos.delete({
    where: {
      playlistId_videoId: {
        playlistId,
        videoId,
      },
    },
  });

  // Update positions of remaining videos
  const remainingVideos = await prisma.playListVideos.findMany({
    where: { playlistId },
    orderBy: { position: 'asc' },
  });

  // Update positions sequentially
  for (let i = 0; i < remainingVideos.length; i++) {
    await prisma.playListVideos.update({
      where: { id: remainingVideos[i].id },
      data: { position: i },
    });
  }

  return { message: 'Video removed from playlist' };
};

export const updateVideoPosition = async (
  playlistId: string,
  videoId: string,
  newPosition: number,
  userId: string
) => {
  // Check if playlist exists and user is the owner
  const playlist = await prisma.playList.findUnique({
    where: { id: playlistId },
  });

  if (!playlist) {
    throw new AppError('Playlist not found', 404);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Not authorized to modify this playlist', 403);
  }

  // Get the playlist item to move
  const itemToMove = await prisma.playListVideos.findUnique({
    where: {
      playlistId_videoId: {
        playlistId,
        videoId,
      },
    },
  });

  if (!itemToMove) {
    throw new AppError('Video not found in playlist', 404);
  }

  const currentPosition = itemToMove.position;
  
  if (currentPosition === newPosition) {
    return { message: 'No change in position' };
  }

  // Get all playlist items ordered by position
  const allItems = await prisma.playListVideos.findMany({
    where: { playlistId },
    orderBy: { position: 'asc' },
  });

  // Remove the item being moved from the array
  const filteredItems = allItems.filter(item => item.id !== itemToMove.id);
  
  // Insert the item at the new position
  filteredItems.splice(newPosition, 0, itemToMove);

  // Update all positions in a transaction
  const updates = filteredItems.map((item: { id: string }, index: number) =>
    prisma.playListVideos.update({
      where: { id: item.id },
      data: { position: index },
    })
  );

  await prisma.$transaction(updates);

  return { message: 'Playlist order updated' };
};

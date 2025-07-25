import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ThumbsUp,
  Share2,
  MoreVertical,
  MessageSquare,
} from "lucide-react";

export default function VideoPage() {
  const video = {
    title: "How to Build a Modern Web Application with Next.js and TypeScript",
    description:
      "In this comprehensive tutorial, we'll walk through building a full-stack web application using Next.js 14, TypeScript, and Tailwind CSS. Learn best practices for state management, API routes, and responsive design. Perfect for developers looking to level up their React skills.\n\n🔗 Resources Mentioned:\n- Next.js Documentation\n- TypeScript Handbook\n- Tailwind CSS Docs\n- Shadcn UI Components",
    url: "https://res.cloudinary.com/djwk8hqyr/video/upload/v1753424643/vizion/videos/ui2mcvxydldpznbxzofu.mp4",
    thumbnail:
      "https://res.cloudinary.com/djwk8hqyr/image/upload/v1753424645/vizion/thumbnails/kqiamwngtwpwlyi5z49l.jpg",
    views: 12453,
    likes: 847,
    comments: 132,
    duration: "12:45",
    createdAt: "2025-07-25T06:24:06.447Z",
    user: {
      name: "CodeWithMe",
      email: "codewithme@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeWithMe",
    },
    category: {
      name: "Education",
    },
  };

  const relatedVideos = [
    {
      title: "Mastering React Hooks: A Complete Guide",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      user: {
        name: "React Masters",
      },
      views: 24567,
      duration: "15:32",
      timestamp: "2 days ago",
    },
    {
      title: "TypeScript for Beginners - Full Course",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      user: {
        name: "TypeScript Pro",
      },
      views: 18932,
      duration: "42:15",
      timestamp: "1 week ago",
    },
    {
      title: "Building a Full Stack App with Next.js 14",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      user: {
        name: "Next.js Masters",
      },
      views: 32145,
      duration: "28:47",
      timestamp: "3 days ago",
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Each",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      user: {
        name: "CSS Wizards",
      },
      views: 15432,
      duration: "18:23",
      timestamp: "5 days ago",
    },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 px-2 py-3">
      <div className="lg:col-span-6 space-y-3">
        <div className="relative w-full aspect-video bg-black rounded-[5px] overflow-hidden">
          <video
            controls
            src={video.url}
            className="w-full h-full object-cover"
            poster={video.thumbnail}
          />
          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 py-0.5 rounded text-[10px]">
            {video.duration}
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-semibold leading-tight">
            {video.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{video.views} views</span>
            <span>•</span>
            <span>
              {new Date(video.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <Badge variant="secondary" className="ml-auto text-xs px-2 py-0">
              {video.category.name}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 py-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full hover:bg-muted px-3 py-1.5 h-8"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{formatNumber(video.likes)}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-muted px-2 py-1.5 h-8"
          >
            <ThumbsUp className="w-4 h-4 transform scale-x-[-1]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full hover:bg-muted px-3 py-1.5 h-8"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full hover:bg-muted px-3 py-1.5 h-8"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{formatNumber(video.comments)}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto rounded-full hover:bg-muted h-8 w-8"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <Separator className="my-2" />

        <div className="bg-muted/20 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-9 h-9">
                <AvatarImage src={video.user.avatar} />
                <AvatarFallback className="text-sm">
                  {video.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm tracking-wider">
                  {video.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(125000)} subscribers
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="gap-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 h-8"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="text-sm">Subscribed</span>
            </Button>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
            {video.description}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h2 className="text-base font-semibold">Up next</h2>

        <ScrollArea className="h-[85vh] pr-1">
          <div className="space-y-2">
            {relatedVideos.map((v, i) => (
              <div
                key={i}
                className="group flex gap-2 p-1.5 rounded-md hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-36 h-20 object-cover rounded-[5px]"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">
                    {v.duration}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h3 className="text-sm font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {v.user.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{formatNumber(v.views)} views</span>
                    <span>•</span>
                    <span>{v.timestamp}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex-shrink-0"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

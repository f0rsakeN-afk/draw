import React from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  ListVideo,
  Clock,
  Star,
  History,
  ThumbsUp,
  Upload,
  Video,
  FolderOpen,
  Settings,
  HelpCircle,
  Users,
} from "lucide-react";

const SidebarNav: React.FC = () => {
  const navSections = [
    {
      title: "Main",
      items: [
        { name: "Home", icon: <Home className="h-4 w-4" /> },
        { name: "Subscriptions", icon: <Users className="h-4 w-4" /> },
        { name: "Categories", icon: <FolderOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: "Library",
      items: [
        { name: "Playlists", icon: <ListVideo className="h-4 w-4" /> },
        { name: "Watch Later", icon: <Clock className="h-4 w-4" /> },
        { name: "History", icon: <History className="h-4 w-4" /> },
        { name: "Liked Videos", icon: <ThumbsUp className="h-4 w-4" /> },
      ],
    },
    {
      title: "Your Content",
      items: [
        { name: "Your Videos", icon: <Video className="h-4 w-4" /> },
        { name: "Uploads", icon: <Upload className="h-4 w-4" /> },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "Settings", icon: <Settings className="h-4 w-4" /> },
        { name: "Help", icon: <HelpCircle className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <aside className="mt-4 space-y-6">
      {navSections.map((section, idx) => (
        <div key={idx}>
          <h4 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">
            {section.title}
          </h4>
          <nav className="flex flex-col gap-1">
            {section.items.map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className="justify-start gap-2 w-full px-3 py-2"
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
};

export default SidebarNav;

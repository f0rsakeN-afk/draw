import React, { useMemo, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Home,
  Compass,
  Flame,
  History,
  ThumbsUp,
  Clock4,
  Video,
  Settings,
  HelpCircle,
  Users,
  Library,
  FolderOpen,
} from "lucide-react";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SidebarNav: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navSections = useMemo<NavSection[]>(
    () => [
      {
        title: "Menu",
        items: [
          {
            name: "Home",
            icon: <Home className="h-5 w-5 flex-shrink-0" />,
            path: "/",
          },
          {
            name: "Explore",
            icon: <Compass className="h-5 w-5 flex-shrink-0" />,
            path: "/explore",
          },
          {
            name: "Shorts",
            icon: <Video className="h-5 w-5 flex-shrink-0" />,
            path: "/shorts",
          },
          {
            name: "Subscriptions",
            icon: <Users className="h-5 w-5 flex-shrink-0" />,
            path: "/feed/subscriptions",
          },
        ],
      },
      {
        title: "You",
        items: [
          {
            name: "Library",
            icon: <Library className="h-5 w-5 flex-shrink-0" />,
            path: "/feed/library",
          },
          {
            name: "History",
            icon: <History className="h-5 w-5 flex-shrink-0" />,
            path: "/feed/history",
          },
          {
            name: "Watch Later",
            icon: <Clock4 className="h-5 w-5 flex-shrink-0" />,
            path: "/playlist?list=WL",
          },
          {
            name: "Liked Videos",
            icon: <ThumbsUp className="h-5 w-5 flex-shrink-0" />,
            path: "/playlist?list=LL",
          },
        ],
      },
      {
        title: "Subscriptions",
        items: [
          // These would be dynamically populated from user's subscriptions
          {
            name: "Music",
            icon: (
              <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
            ),
            path: "/@music",
          },
          {
            name: "Gaming",
            icon: (
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
            ),
            path: "/@gaming",
          },
        ],
      },
      {
        title: "Explore",
        items: [
          {
            name: "Trending",
            icon: <Flame className="h-5 w-5 flex-shrink-0" />,
            path: "/trending",
          },
          {
            name: "Music",
            icon: <FolderOpen className="h-5 w-5 flex-shrink-0" />,
            path: "/music",
          },
          {
            name: "Gaming",
            icon: <FolderOpen className="h-5 w-5 flex-shrink-0" />,
            path: "/gaming",
          },
        ],
      },
      {
        title: "More from Vizion",
        items: [
          {
            name: "Vizion Premium",
            icon: <Video className="h-5 w-5 flex-shrink-0" />,
            path: "/premium",
          },
          {
            name: "Settings",
            icon: <Settings className="h-5 w-5 flex-shrink-0" />,
            path: "/settings",
          },
          {
            name: "Help",
            icon: <HelpCircle className="h-5 w-5 flex-shrink-0" />,
            path: "/help",
          },
        ],
      },
    ],
    []
  );

  /*   const isNavItemActive = useCallback((path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  }, [pathname]); */

  return (
    <ScrollArea className="h-full px-2 py-4">
      <nav className="space-y-8">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-2">
            {section.title && (
              <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      item.disabled && "opacity-50 pointer-events-none"
                    )
                  }
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNav;

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SidebarNav from "./SideNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  Settings,
  Sun,
  User,
  Video,
  /*  Youtube, */
} from "lucide-react";
import Logo from "../shared/Logo";
import SearchBar from "./SearchBar";

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  /*  const [isSearchFocused, setIsSearchFocused] = useState(false); */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  /*  const handleSearchFocus = (focused: boolean) => {
    setIsSearchFocused(focused);
  }; */

  const userMenuItems = [
    {
      label: "Your channel",
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate("/channel/me"),
    },
    {
      label: "Studio",
      icon: <Video className="h-4 w-4" />,
      onClick: () => window.open("https://studio.youtube.com", "_blank"),
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate("/settings"),
    },
  ];

  const themeMenuItem = {
    label: `Appearance: ${theme === "light" ? "Light" : "Dark"}`,
    icon:
      theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      ),
    onClick: handleThemeToggle,
  };

  const helpMenuItems = [
    {
      label: "Help",
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () =>
        window.open("https://support.google.com/youtube", "_blank"),
    },
    {
      label: "Send feedback",
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => alert("Send feedback form will open here"),
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-all",
        isScrolled ? "shadow-sm" : ""
        /*         isSearchFocused ? "bg-background" : "" */
      )}
    >
      <div className="flex h-14 items-center justify-between w-full container mx-auto px-2 gap-2">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Menu"
              >
                <Menu className="md:h-5 md:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-20 items-center px-4 border-b">
                <Logo />
              </div>
              <ScrollArea className="h-[calc(100%-3.5rem)]">
                <SidebarNav />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <span className="hidden md:flex">
            <Logo />
          </span>
        </div>

        {/* Center section - Search */}
        <div className="flex-1  max-w-2xl ">
          <SearchBar
          /*  onFocusChange={handleSearchFocus} */
          /* className={isSearchFocused ? "ring-2 ring-ring ring-offset-2" : ""} */
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex"
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Search with your voice</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex"
          >
            <Video className="h-5 w-5" />
            <span className="sr-only">Create</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hidden md:flex"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={10}>
              <div className="flex items-center gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">User Name</p>
                  <p className="text-xs text-muted-foreground truncate">
                    @username
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={item.onClick}>
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={themeMenuItem.onClick}>
                <span className="mr-2">{themeMenuItem.icon}</span>
                <span>{themeMenuItem.label}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {helpMenuItems.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={item.onClick}>
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => console.log("Sign out")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} Vizion, Inc.</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  className,
  children,
  hideHeader = false,
  hideFooter = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={cn("flex flex-col min-h-screen bg-background font-inter", className)}>
      {!hideHeader && <Header />}

      <main className="flex-1 w-full container mx-auto px-2">
        {children || <Outlet />}
      </main>

      {!hideFooter && <Footer />}

      <ScrollToTop />
    </div>
  );
};

export default Layout;

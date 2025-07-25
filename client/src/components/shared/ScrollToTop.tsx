import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScrollToTopProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The scroll position from the top of the page (in pixels) at which the button appears
   * @default 300
   */
  showAfter?: number;
  
  /**
   * Additional class name for the button
   */
  className?: string;
  
  /**
   * Whether to automatically scroll to top on route change
   * @default true
   */
  autoScrollOnRouteChange?: boolean;
}

/**
 * A component that shows a scroll-to-top button when the user scrolls down the page
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({
  showAfter = 300,
  className,
  autoScrollOnRouteChange = true,
  ...props
}) => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  // Scroll to top on route change
  useEffect(() => {
    if (autoScrollOnRouteChange) {
      window.scrollTo(0, 0);
    }
  }, [pathname, autoScrollOnRouteChange]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-opacity duration-200',
        'h-11 w-11 p-0',
        'bg-background/80 backdrop-blur-sm hover:bg-background/90',
        'text-foreground hover:text-primary',
        'shadow-foreground/10 hover:shadow-foreground/20',
        'dark:bg-background/70 dark:hover:bg-background/90',
        className
      )}
      aria-label="Scroll to top"
      {...props}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default ScrollToTop;

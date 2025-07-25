import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  /*   onFocusChange?: (focused: boolean) => void; */
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  onSearch,
  /*   onFocusChange, */
}) => {
  const [query, setQuery] = useState("");
  /*   const [isFocused, setIsFocused] = useState(false); */
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  /* const handleFocusChange = useCallback(
    (focused: boolean) => {
      setIsFocused(focused);
      onFocusChange?.(focused);
    },
    [onFocusChange]
  );
 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      navigate(`/results?search_query=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // Only clear input on Escape if not empty
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && query) {
        e.preventDefault();
        clearSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-xl ", className)}
    >
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search videos, channels, and more"
          className={cn(
            "md:pr-20 text-sm h-10 transition-all duration-200",
            "focus:outline-none focus:ring-0 focus:border-none"
            /*  isFocused ? "rounded-full" : "" */
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          /* onFocus={() => handleFocusChange(true)}
          onBlur={() => handleFocusChange(false)} */
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-10 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="submit"
          variant="default"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 h-8 w-10 -translate-y-1/2 rounded-r-md rounded-l-none transition-colors",
            query.trim()
              ? "bg-primary/90 hover:bg-primary"
              : "bg-muted text-muted-foreground"
          )}
          disabled={!query.trim()}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <form className="flex w-full max-w-md items-center gap-2">
      <Input
        type="text"
        placeholder="Search"
        className="flex-1"
      />
      <Button type="submit" variant="secondary" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;

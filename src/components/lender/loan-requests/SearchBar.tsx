import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex items-center ">
      <Search className=" h-4 w-4 text-muted-foreground z-10 mr-[-28px]" />
      <Input
        type="text"
        placeholder="Search by borrower or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64  dark:text-gray-300  dark:bg-gray-800  pl-8 "
      />
    </div>
  );
}

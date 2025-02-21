import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <Input
      type="text"
      placeholder="Search by borrower or ID..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-64"
    />
  );
}

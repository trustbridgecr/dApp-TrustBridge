'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (value: string) => void;
  inputClassName?: string;
}

export function SearchBar({ onSearch, inputClassName }: SearchBarProps) {
  return (
    <div className='relative w-full'>
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        type='search'
        placeholder='Search...'
        className={`pl-8 w-full md:w-[300px] ${inputClassName}`}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

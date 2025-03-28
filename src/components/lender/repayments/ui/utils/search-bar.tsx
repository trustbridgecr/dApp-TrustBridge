'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className='relative w-full'>
      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
      <Input
        type='search'
        placeholder={t('common.search.placeholder.default')}
        className={`pl-8 w-full md:w-[300px] text-white bg-[#1C2530] border-[#63CDE6]/20 focus-visible:border-[#63CDE6]/20 focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ''}`}
        onChange={(e) => onSearch(e.target.value)}
        aria-label={t('common.search.aria.label')}
      />
    </div>
  );
}

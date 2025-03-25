'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Status } from '@/@types/repayment.entity';
import { statuses } from '../../constants/status-filter.constant';

interface StatusFilterProps {
  selectedStatus: Status;
  onStatusChange: (status: Status) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='w-[150px] justify-between dark:bg-[#1C2530] dark:text-gray-300'
        >
          {statuses.find((s) => s.value === selectedStatus)?.label}
          <Check className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.value}
            checked={selectedStatus === status.value}
            onCheckedChange={() => onStatusChange(status.value)}
          >
            {status.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

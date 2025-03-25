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
          className='w-[150px] justify-between bg-[#1C2530] hover:bg-[#1C2A3E]/30 hover:text-white border-[#63CDE6]/20 text-gray-300'
        >
          {statuses.find((s) => s.value === selectedStatus)?.label}
          <Check className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-[150px] bg-[#1C2530] border-none text-white'
      >
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status.value}
            checked={selectedStatus === status.value}
            onCheckedChange={() => onStatusChange(status.value)}
            className='hover:bg-[#1C2A3E]/50'
          >
            {status.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

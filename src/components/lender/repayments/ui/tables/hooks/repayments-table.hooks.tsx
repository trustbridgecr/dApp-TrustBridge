import { Repayment } from '@/@types/repayment.entity';
import { useMemo, useState } from 'react';
import { data } from '../../../mock/repayment.mock';
import { RepaymentsTableProps } from '../repayments-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const useRepaymentsTable = ({
  searchQuery,
  statusFilter,
}: RepaymentsTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Repayment;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(query) ||
          item.borrower.toLowerCase().includes(query) ||
          item.loanId.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, statusFilter, sortConfig]);

  const handleSort = (key: keyof Repayment) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortButton = (label: string, key: keyof Repayment) => (
    <Button
      variant='ghost'
      onClick={() => handleSort(key)}
      className='hover:bg-transparent dark:text-[#63CDE6] font-semibold px-2'
    >
      {label}
      <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
  );

  return {
    filteredAndSortedData,
    renderSortButton,
  };
};

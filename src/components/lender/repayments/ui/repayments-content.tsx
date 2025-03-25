'use client';

import { useState } from 'react';
import { SearchBar } from './utils/search-bar';
import { StatusFilter } from './filters/status-filter';
import { RepaymentsTable } from './tables/repayments-table';
import { Status } from '@/@types/repayment.entity';

export default function RepaymentsContent() {
  const [status, setStatus] = useState<Status>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='p-6 space-y-8 sm:space-y-12 dark:bg-darkbg w-full'>
      <div className='flex max-sm:flex-col justify-between sm:items-center max-sm:gap-8'>
        <div className='relative inline-block w-fit'>
          <h1 className='text-2xl sm:text-3xl font-bold dark:bg-gradient-to-r dark:from-[#63CDE6] dark:to-[#6AD09E] dark:text-transparent dark:bg-clip-text'>
            Loan Repayments
          </h1>
          <div className='absolute -bottom-2 left-0 w-full h-[3px]'>
            <div className='h-full w-full bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:to-green-400 rounded-full'></div>
            <div className='h-full w-[60%] bg-white dark:bg-gradient-to-r dark:from-blue-600 dark:to-green-400 mt-1 opacity-50 rounded-full'></div>
          </div>
        </div>

        <button
          type='button'
          className='dark:text-white border dark:bg-[#0F1927] max-sm:self-end flex space-x-2 items-center shadow-[0px_0px_12px_1px_rgba(99,205,230,0.25)] font-medium rounded-full text-sm px-3 sm:px-5 py-2.5 text-center me-2 mb-2'
        >
          <div className='h-3 w-3 sm:h-4 sm:w-4 bg-[#63CDE6] rounded-full'></div>
          <span>Payment Tracking</span>
        </button>
      </div>

      <div className='space-y-6 sm:space-y-10 w-full'>
        <div className='rounded-2xl p-6 flex gap-4 flex-col md:flex-row justify-between md:items-center dark:bg-[#0F1927] border  dark:border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)]'>
          <p className='text-sm lg:text-base text-muted-foreground mt-2'>
            Track and manage all loan repayments.
          </p>
          <div className='flex flex-row max-sm:flex-col gap-4 items-start items-centers md:justify-between'>
            <SearchBar
              onSearch={setSearchQuery}
              inputClassName=' dark:bg-[#1C2530]'
            />
            <div className='max-sm:self-end'>
              <StatusFilter
                selectedStatus={status}
                onStatusChange={setStatus}
              />
            </div>
          </div>
        </div>
        <RepaymentsTable searchQuery={searchQuery} statusFilter={status} />
      </div>
    </div>
  );
}

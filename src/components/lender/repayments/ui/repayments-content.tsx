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
    <div className='p-6 space-y-8 sm:space-y-12 bg-gradient-to-b from-[#0B1120] via-[#0B1120] to-[#121E31] w-full'>
      <div className='flex max-sm:flex-col justify-between sm:items-center max-sm:gap-8'>
        <div className='relative inline-block w-fit'>
          <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#63CDE6] to-[#6AD09E] text-transparent bg-clip-text'>
            Loan Repayments
          </h1>
          <div className='absolute -bottom-2 left-0 w-full h-[3px]'>
            <div className='h-full w-full bg-white bg-gradient-to-r from-blue-600 to-green-400 rounded-full'></div>
            <div className='h-full w-[60%] bg-white bg-gradient-to-r from-blue-600 to-green-400 mt-1 opacity-50 rounded-full'></div>
          </div>
        </div>

        <button
          type='button'
          className='text-white border border-[#63CDE6]/20 bg-[#0F1927] max-sm:self-end flex space-x-2 items-center shadow-[0px_0px_12px_1px_rgba(99,205,230,0.25)] font-medium rounded-full text-sm px-3 sm:px-5 py-2.5 text-center me-2 mb-2'
        >
          <div className='h-3 w-3 sm:h-4 sm:w-4 bg-[#63CDE6] rounded-full'></div>
          <span>Payment Tracking</span>
        </button>
      </div>

      <div className='space-y-6 sm:space-y-10 w-full'>
        <div className='rounded-2xl p-6 flex gap-4 flex-col md:flex-row justify-between md:items-center bg-[#0F1927] border  border-[#63CDE6]/20 shadow-[0px_0px_8px_2px_rgba(99,205,230,0.15)]'>
          <p className='text-sm lg:text-base text-gray-300 mt-2'>
            Track and manage all loan repayments.
          </p>
          <div className='flex flex-row max-sm:flex-col gap-4 items-start items-centers md:justify-between'>
            <SearchBar onSearch={setSearchQuery} />
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

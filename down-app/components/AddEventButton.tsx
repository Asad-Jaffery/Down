'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

interface AddEventButtonProps {
  onClick: () => void;
  className?: string;
}

export default function AddEventButton({
  onClick,
  className = '',
}: AddEventButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-[var(--primary)] text-[var(--background)] py-4 px-6 rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 text-lg ${className}`}
    >
      <PlusIcon className='w-6 h-6' />
      <span>Create New Event</span>
    </button>
  );
}

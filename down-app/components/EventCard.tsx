'use client';

import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Event } from '@/contexts/EventContext';

interface EventCardProps {
  event: Event;
  onRSVP: (
    eventId: string,
    response: 'down' | 'not-this-time'
  ) => Promise<void>;
}

export default function EventCard({ event, onRSVP }: EventCardProps) {
  const attendeeCount = Object.keys(event.attendees).length;
  const attendeeList = Object.entries(event.attendees).slice(0, 5);

  return (
    <div className='bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-4 mb-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
          {event.name}
        </h3>
        <span className='text-xs text-[var(--text-secondary)] bg-[var(--border)] px-2 py-1 rounded-full'>
          {attendeeCount} people are down
        </span>
      </div>

      <div className='space-y-2 mb-4'>
        <div className='flex items-center text-sm text-[var(--text-secondary)]'>
          <MapPinIcon className='w-4 h-4 mr-2 text-[var(--text-muted)]' />
          {event.place}
        </div>
        <div className='flex items-center text-sm text-[var(--text-secondary)]'>
          <ClockIcon className='w-4 h-4 mr-2 text-[var(--text-muted)]' />
          {event['event-time']}
        </div>
      </div>

      {/* Attendees */}
      <div className='mb-4'>
        <div className='flex items-center mb-2'>
          <UserGroupIcon className='w-4 h-4 mr-2 text-[var(--text-secondary)]' />
          <span className='text-sm text-[var(--text-secondary)]'>
            Attendees
          </span>
        </div>
        <div className='flex -space-x-2'>
          {attendeeList.map(([username, displayName]) => (
            <div
              key={username}
              className='w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-[var(--background)] text-xs font-medium border-2 border-[var(--card-bg)]'
              title={displayName}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          ))}
          {attendeeCount > 5 && (
            <div className='w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-medium border-2 border-[var(--card-bg)]'>
              +{attendeeCount - 5}
            </div>
          )}
        </div>
      </div>

      {/* RSVP Buttons */}
      <div className='flex space-x-2'>
        <button
          onClick={() => onRSVP(event.id, 'down')}
          className='flex-1 bg-[var(--primary)] text-[var(--background)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center'
        >
          <CheckIcon className='w-4 h-4 mr-1' />
          Down
        </button>
        <button
          onClick={() => onRSVP(event.id, 'not-this-time')}
          className='flex-1 bg-[var(--border)] text-[var(--text-secondary)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--border-light)] transition-colors flex items-center justify-center'
        >
          <XMarkIcon className='w-4 h-4 mr-1' />
          Not this time
        </button>
      </div>
    </div>
  );
}

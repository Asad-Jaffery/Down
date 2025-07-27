'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CreateEventData } from '@/contexts/EventContext';

interface Friend {
  id: string;
  name: string;
}

interface EventFormProps {
  friends: Friend[];
  onSubmit: (eventData: CreateEventData) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({
  friends,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [activity, setActivity] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity || !location || !time) return;

    onSubmit({
      activity,
      location,
      time,
      selectedFriends,
    });
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className='bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border)] p-6 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-[var(--text-primary)]'>
          Create Event
        </h2>
        <button
          onClick={onCancel}
          className='p-2 text-[var(--text-secondary)] hover:text-[var(--text-muted)] transition-colors'
        >
          <XMarkIcon className='w-5 h-5' />
        </button>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            Activity
          </label>
          <input
            type='text'
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder='What are you doing?'
            className='w-full px-4 py-3 bg-[var(--card-bg-dark)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            Location
          </label>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Where are you meeting?'
            className='w-full px-4 py-3 bg-[var(--card-bg-dark)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            Time
          </label>
          <input
            type='datetime-local'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className='w-full px-4 py-3 bg-[var(--card-bg-dark)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            Invite Friends
          </label>
          <div className='space-y-2 max-h-32 overflow-y-auto'>
            {friends.map((friend) => (
              <label
                key={friend.id}
                className='flex items-center space-x-3 p-2 rounded-lg hover:bg-[var(--border)] cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => toggleFriend(friend.id)}
                  className='w-4 h-4 text-[var(--primary)] bg-[var(--card-bg-dark)] border-[var(--border)] rounded focus:ring-[var(--primary)]'
                />
                <span className='text-[var(--text-primary)]'>
                  {friend.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className='flex space-x-3 pt-4'>
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 bg-[var(--border)] text-[var(--text-secondary)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--border-light)] transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='flex-1 bg-[var(--primary)] text-[var(--background)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors'
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

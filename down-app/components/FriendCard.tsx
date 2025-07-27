'use client';

import { BellIcon } from '@heroicons/react/24/outline';

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'down' | 'offline';
  avatar?: string;
}

interface FriendCardProps {
  friend: Friend;
  onNotify: (friendId: string) => void;
}

export default function FriendCard({ friend, onNotify }: FriendCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-[var(--success)]/20 text-[var(--success)]';
      case 'busy':
        return 'bg-[var(--warning)]/20 text-[var(--warning)]';
      case 'down':
        return 'bg-[var(--info)]/20 text-[var(--info)]';
      default:
        return 'bg-[var(--text-muted)]/20 text-[var(--text-muted)]';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'busy':
        return 'Busy';
      case 'down':
        return 'Down';
      default:
        return 'Offline';
    }
  };

  return (
    <div className='bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-4 mb-3 hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          {/* Avatar */}
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center text-[var(--background)] font-medium'>
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.name}
                className='w-full h-full rounded-full object-cover'
              />
            ) : (
              friend.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Name and Status */}
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-[var(--text-primary)]'>
              {friend.name}
            </h3>
            <div className='flex items-center space-x-2'>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  friend.status
                )}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    friend.status === 'online'
                      ? 'bg-[var(--success)]'
                      : friend.status === 'busy'
                      ? 'bg-[var(--warning)]'
                      : friend.status === 'down'
                      ? 'bg-[var(--info)]'
                      : 'bg-[var(--text-muted)]'
                  }`}
                />
                {getStatusText(friend.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Notify Button */}
        <button
          onClick={() => onNotify(friend.id)}
          className='p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--border)] rounded-lg transition-colors'
          title='Notify friend'
        >
          <BellIcon className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
}

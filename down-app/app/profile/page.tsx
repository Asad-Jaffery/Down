'use client';

import { useState } from 'react';
import {
  PencilIcon,
  PhoneIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Navigation from '@/components/Navigation';
import ProfilePic from '@/components/ProfilePic';
import EventCard from '@/components/EventCard';

// Mock data
const mockUser = {
  id: '1',
  name: 'John Doe',
  phone: '+1 (555) 123-4567',
  avatar: '',
};

const mockUserEvents = [
  {
    id: '1',
    activity: 'Coffee at Starbucks',
    location: 'Starbucks Downtown',
    time: '2024-01-15T10:00',
    attendees: [
      { id: '1', name: 'Alice', avatar: '' },
      { id: '2', name: 'Bob', avatar: '' },
      { id: '3', name: 'Charlie', avatar: '' },
    ],
  },
  {
    id: '2',
    activity: 'Movie Night',
    location: 'AMC Theater',
    time: '2024-01-16T19:00',
    attendees: [
      { id: '1', name: 'Alice', avatar: '' },
      { id: '4', name: 'Diana', avatar: '' },
    ],
  },
];

export default function ProfilePage() {
  const [user] = useState(mockUser);
  const [userEvents] = useState(mockUserEvents);

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // In a real app, this would open an edit profile modal
  };

  const handleRSVP = (eventId: string, response: 'down' | 'not-this-time') => {
    console.log(`RSVP for event ${eventId}: ${response}`);
    // In a real app, this would update the backend
  };

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <Navigation />

      {/* Main Content */}
      <div className='max-w-2xl mx-auto px-4 pb-20 md:pb-6 pt-4'>
        {/* Profile Header */}
        <div className='bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-6 mb-6'>
          <div className='flex items-center space-x-4 mb-4'>
            <ProfilePic
              src={user.avatar}
              alt={user.name}
              size='xl'
              name={user.name}
            />
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-[var(--text-primary)]'>
                {user.name}
              </h1>
              <div className='flex items-center text-[var(--text-secondary)] mt-1'>
                <PhoneIcon className='w-4 h-4 mr-2' />
                <span className='text-sm'>{user.phone}</span>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className='p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--border)] rounded-lg transition-colors'
              title='Edit Profile'
            >
              <PencilIcon className='w-5 h-5' />
            </button>
          </div>

          <button
            onClick={handleEditProfile}
            className='w-full bg-[var(--primary)] text-[var(--background)] py-2 px-4 rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors'
          >
            Edit Profile
          </button>
        </div>

        {/* User Events */}
        <div className='mb-6'>
          <div className='flex items-center mb-4'>
            <CalendarIcon className='w-5 h-5 text-[var(--text-muted)] mr-2' />
            <h2 className='text-xl font-semibold text-[var(--text-primary)]'>
              My Events
            </h2>
          </div>

          {userEvents.length > 0 ? (
            <div className='space-y-4'>
              {userEvents.map((event) => (
                <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)]'>
              <CalendarIcon className='w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4' />
              <h3 className='text-lg font-medium text-[var(--text-primary)] mb-2'>
                No events yet
              </h3>
              <p className='text-[var(--text-secondary)]'>
                Create your first event to get started
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className='bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-6'>
          <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
            Stats
          </h3>
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[var(--primary)]'>
                {userEvents.length}
              </div>
              <div className='text-sm text-[var(--text-secondary)]'>
                Events Created
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[var(--success)]'>12</div>
              <div className='text-sm text-[var(--text-secondary)]'>
                Events Joined
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-[var(--primary)]'>8</div>
              <div className='text-sm text-[var(--text-secondary)]'>
                Friends
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

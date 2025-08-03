'use client';

import { useMemo } from 'react';
import {
  PencilIcon,
  PhoneIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Navigation from '@/components/Navigation';
import ProfilePic from '@/components/ProfilePic';
import EventCard from '@/components/EventCard';
import { EventContext, useEventContext } from '@/contexts/EventContext';
import { useUser } from '@/contexts/UserContext';

function ProfilePageContent() {
  const { events, loading, handleRSVP } = useEventContext();
  const { user } = useUser();

  // Filter events to show only current user's events
  const userEvents = useMemo(() => {
    if (!user) return [];
    return events.filter((event) => event.creator === user.username);
  }, [events, user]);

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // In a real app, this would open an edit profile modal
  };

  // Show loading if user context is still loading
  if (!user) {
    return (
      <div className='min-h-screen bg-[var(--background)] flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-[var(--text-secondary)]'>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <Navigation />

      {/* Main Content */}
      <div className='max-w-2xl mx-auto px-4 pb-20 md:pb-6 pt-4'>
        {/* Profile Header */}
        <div className='bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)] p-6 mb-6'>
          <div className='flex items-center space-x-4 mb-4'>
            <ProfilePic
              src={''} // TODO: Add avatar support to user context
              alt={user.displayName}
              size='xl'
              name={user.displayName}
            />
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-[var(--text-primary)]'>
                {user.displayName}
              </h1>
              <div className='flex items-center text-[var(--text-secondary)] mt-1'>
                <span className='text-sm'>@{user.username}</span>
              </div>
              <div className='flex items-center text-[var(--text-secondary)] mt-1'>
                <PhoneIcon className='w-4 h-4 mr-2' />
                <span className='text-sm'>
                  {user.authMethod} authentication
                </span>
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

          {loading ? (
            <div className='text-center py-8'>
              <p className='text-[var(--text-secondary)]'>Loading events...</p>
            </div>
          ) : userEvents.length > 0 ? (
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
              <div className='text-2xl font-bold text-[var(--success)]'>
                {
                  events.filter(
                    (event) => event.attendees[user.username] // Count events where user is attending
                  ).length
                }
              </div>
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

export default function ProfilePage() {
  const eventContextValue = useEventContext();

  return (
    <EventContext.Provider value={eventContextValue}>
      <ProfilePageContent />
    </EventContext.Provider>
  );
}

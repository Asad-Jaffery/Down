'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import EventCard from '@/components/EventCard';
import EventForm from '@/components/EventForm';
import AddEventButton from '@/components/AddEventButton';
import { EventContext, useEventContext } from '@/contexts/EventContext';

const mockFriends = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Eve Wilson' },
];

function HomePageContent() {
  const { events, loading, createEvent, handleRSVP } = useEventContext();
  const [showEventForm, setShowEventForm] = useState(false);

  const handleCreateEvent = async (eventData: {
    activity: string;
    location: string;
    time: string;
    selectedFriends: string[];
  }) => {
    try {
      await createEvent(eventData);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <Navigation />

      {/* Main Content */}
      <div className='max-w-2xl mx-auto px-4 pb-20 md:pb-6 pt-4'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-2'>
            Events
          </h1>
          <p className='text-[var(--text-secondary)]'>
            See what&apos;s happening with your friends
          </p>
        </div>

        {/* Add Event Button */}
        <div className='mb-6'>
          <AddEventButton onClick={() => setShowEventForm(true)} />
        </div>

        {/* Create Event Form */}
        {showEventForm && (
          <EventForm
            friends={mockFriends}
            onSubmit={handleCreateEvent}
            onCancel={() => setShowEventForm(false)}
          />
        )}

        {/* Event Feed */}
        <div className='space-y-4'>
          {loading ? (
            <div className='text-center py-8'>
              <p className='text-[var(--text-secondary)]'>Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
            ))
          ) : (
            <div className='text-center py-12 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)]'>
              <p className='text-[var(--text-secondary)] mb-4'>No events yet</p>
              <p className='text-[var(--text-muted)]'>
                Looks like no ones down for anything 🙁. Be the first!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const eventContextValue = useEventContext();

  return (
    <EventContext.Provider value={eventContextValue}>
      <HomePageContent />
    </EventContext.Provider>
  );
}

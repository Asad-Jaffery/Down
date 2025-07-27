'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import EventCard from '@/components/EventCard';
import EventForm from '@/components/EventForm';
import AddEventButton from '@/components/AddEventButton';

// Mock data
const mockEvents = [
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
  {
    id: '3',
    activity: 'Hiking Trip',
    location: 'Mountain Trail Park',
    time: '2024-01-17T09:00',
    attendees: [
      { id: '2', name: 'Bob', avatar: '' },
      { id: '3', name: 'Charlie', avatar: '' },
      { id: '5', name: 'Eve', avatar: '' },
    ],
  },
];

const mockFriends = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
  { id: '5', name: 'Eve Wilson' },
];

export default function HomePage() {
  const [events, setEvents] = useState(mockEvents);
  const [showEventForm, setShowEventForm] = useState(false);

  const handleRSVP = (eventId: string, response: 'down' | 'not-this-time') => {
    console.log(`RSVP for event ${eventId}: ${response}`);
    // In a real app, this would update the backend
  };

  const handleCreateEvent = (eventData: {
    activity: string;
    location: string;
    time: string;
    selectedFriends: string[];
  }) => {
    const newEvent = {
      id: Date.now().toString(),
      activity: eventData.activity,
      location: eventData.location,
      time: eventData.time,
      attendees: [],
    };

    setEvents((prev) => [newEvent, ...prev]);
    setShowEventForm(false);
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
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
          ))}
        </div>
      </div>
    </div>
  );
}

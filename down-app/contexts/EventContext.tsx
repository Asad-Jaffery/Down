'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from './UserContext';

// Event structure interfaces
export interface EventAttendees {
  [username: string]: string; // username -> display name
}

export interface Event {
  id: string;
  name: string;
  place: string;
  'event-time': string; // Firebase timestamp string
  'time-created': string; // Firebase timestamp string
  creator: string; // username
  'is-active': boolean;
  attendees: EventAttendees;
}

export interface CreateEventData {
  name: string;
  place: string;
  'event-time': string;
  selectedFriends?: string[];
}

// Context type definition
export interface EventContextType {
  events: Event[];
  loading: boolean;
  createEvent: (eventData: CreateEventData) => Promise<void>;
  handleRSVP: (
    eventId: string,
    response: 'down' | 'not-this-time'
  ) => Promise<void>;
  loadEvents: () => Promise<void>;
}

export async function getEvents() {
  // this eventually needs to change to only get events for the current user's friends
  const snapshot = await getDocs(collection(db, 'events'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Event[];
}

export async function getUsersEvents(currentUserUsername?: string) {
  if (!currentUserUsername) {
    console.warn('No current user username provided');
    return [];
  }

  const snapshot = await getDocs(collection(db, 'events'));
  const allEvents = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[];

  // Filter events where the current user is the creator
  return allEvents.filter((event) => event.creator === currentUserUsername);
}

export async function getFriendsEvents() {
  // TODO: Implement function to get events from user's friends
  return [] as Event[];
}

// Create the context
export const EventContext = createContext<EventContextType | undefined>(
  undefined
);

// Custom hook to use the context
export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

// Hook to create event context state
export function useEventContext() {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData) => {
    if (!user) {
      throw new Error('User must be authenticated to create events');
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const newEvent = {
        name: eventData.name,
        place: eventData.place,
        'event-time': eventData['event-time'],
        'time-created': now,
        creator: user.username,
        'is-active': true,
        attendees: {}, // Start with empty attendees object
      };

      const docRef = await addDoc(collection(db, 'events'), newEvent);

      const createdEvent: Event = {
        id: docRef.id,
        ...newEvent,
      };

      setEvents((prev) => [createdEvent, ...prev]);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (
    eventId: string,
    response: 'down' | 'not-this-time'
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to RSVP');
    }

    try {
      // For now, we'll just log the RSVP
      // In a real app, you'd update the event in Firestore
      console.log(`RSVP for event ${eventId}: ${response}`);

      // Update local state to reflect the RSVP
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? {
                ...event,
                attendees:
                  response === 'down'
                    ? { ...event.attendees, [user.username]: user.displayName }
                    : event.attendees,
              }
            : event
        )
      );
    } catch (error) {
      console.error('Error handling RSVP:', error);
      throw error;
    }
  };

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    createEvent,
    handleRSVP,
    loadEvents,
  };
}

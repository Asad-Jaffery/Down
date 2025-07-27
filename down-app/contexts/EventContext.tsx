// contexts/EventContext.tsx
'use client';

import {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Event structure interfaces
export interface EventAttendee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  activity: string;
  location: string;
  time: string;
  attendees: EventAttendee[];
}

export interface CreateEventData {
  activity: string;
  location: string;
  time: string;
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
    setLoading(true);
    try {
      const newEvent = {
        activity: eventData.activity,
        location: eventData.location,
        time: eventData.time,
        attendees: eventData.selectedFriends || [],
      };

      const docRef = await addDoc(collection(db, 'events'), newEvent);

      const createdEvent: Event = {
        id: docRef.id,
        ...newEvent,
        attendees: [], // Start with empty attendees array
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
    try {
      // For now, we'll just log the RSVP
      // In a real app, you'd update the event in Firestore
      console.log(`RSVP for event ${eventId}: ${response}`);

      // Update local state to reflect the RSVP
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, attendees: [...event.attendees] } // Add user to attendees if 'down'
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

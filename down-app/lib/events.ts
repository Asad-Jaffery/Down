import { collection, addDoc, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase'; 

interface event {
    eventName: string;
    location: string;
    time: Timestamp;
    attendees: string[];
}

// Add an event
export async function createEvent(eventData : event) {
  const docRef = await addDoc(collection(db, 'events'), eventData);
  return docRef.id;
}

// Get all events -- need to edit to make sure it's only friend events, and ones that are in the future
export async function getEvents() {
  const snapshot = await getDocs(collection(db, 'events'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update RSVP
export async function updateEventRSVP(eventId: string, attendees: any[]) {
  const eventRef = doc(db, 'events', eventId);
  await updateDoc(eventRef, { attendees });
}

function getMinuteTimestamp(date: Date): Timestamp {
    date.setSeconds(0, 0); // strip to minute precision
    return Timestamp.fromDate(date);
  }
  
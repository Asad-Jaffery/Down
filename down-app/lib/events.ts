import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase'; 

// Add an event
export async function createEvent(eventData: any) {
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
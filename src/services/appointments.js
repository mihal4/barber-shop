// src/services/appointments.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return { success: false, error: error.message }
  }
}

// Get all appointments (for admin)
export const getAppointments = async () => {
  try {
    const q = query(
      collection(db, 'appointments'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return { 
      success: true, 
      data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return { success: false, error: error.message }
  }
}

// Get appointments by email
export const getAppointmentsByEmail = async (email) => {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return { 
      success: true, 
      data: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) 
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return { success: false, error: error.message }
  }
}
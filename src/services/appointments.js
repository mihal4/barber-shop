// src/services/appointments.js
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { notifyAdminNewAppointment, notifyClientStatusChange } from "./email";

const toStoredDate = (isoDate) => {
  if (!isoDate) return isoDate;
  const [y, m, d] = isoDate.split("-");
  return `${d}.${m}.${y}`;
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      date: toStoredDate(appointmentData.date),
      status: "pending",
      createdAt: serverTimestamp(),
    });
    // Fire-and-forget — email failure must not break the booking
    notifyAdminNewAppointment(appointmentData).catch(console.error);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: error.message };
  }
};

// Get all appointments (for admin)
export const getAppointments = async () => {
  try {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: error.message };
  }
};

// Update appointment status
export const updateAppointmentStatus = async (id, status, appointment) => {
  try {
    await updateDoc(doc(db, "appointments", id), { status });
    if (appointment) {
      notifyClientStatusChange(appointment, status).catch(console.error);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error: error.message };
  }
};

// Delete appointment
export const deleteAppointment = async (id) => {
  try {
    await deleteDoc(doc(db, "appointments", id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.message };
  }
};

// Get all taken time slots for a given date
export const getTakenSlots = async (date) => {
  try {
    const q = query(collection(db, "appointments"), where("date", "==", toStoredDate(date)));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => doc.data())
      .filter((d) => d.status === "pending" || d.status === "confirmed")
      .map((d) => d.time);
  } catch (error) {
    console.error("Error fetching taken slots:", error);
    return [];
  }
};

// Check if a date+time slot is already taken
export const isSlotTaken = async (date, time) => {
  const taken = await getTakenSlots(date);
  return taken.includes(time);
};

// Get appointments by email
export const getAppointmentsByEmail = async (email) => {
  try {
    const q = query(
      collection(db, "appointments"),
      where("email", "==", email),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return {
      success: true,
      data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: error.message };
  }
};

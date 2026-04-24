import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const notifyAdminNewAppointment = async (appointment) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS env vars not set — skipping admin notification");
    return;
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      client_name: appointment.name,
      client_email: appointment.email,
      client_phone: appointment.phone,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || "—",
    },
    PUBLIC_KEY,
  );
};

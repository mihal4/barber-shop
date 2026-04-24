import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const STATUS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const STATUS_LABELS = {
  pending: { en: "Pending", sk: "čakajúci" },
  confirmed: { en: "Confirmed", sk: "potvrdený" },
  cancelled: { en: "Cancelled", sk: "zrušený" },
};

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

export const notifyClientStatusChange = async (appointment, status) => {
  if (!SERVICE_ID || !STATUS_TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      "EmailJS status template not set — skipping client notification",
    );
    return;
  }

  const statusLabel =
    STATUS_LABELS[status]?.sk ?? STATUS_LABELS[status]?.en ?? status;

  await emailjs.send(
    SERVICE_ID,
    STATUS_TEMPLATE_ID,
    {
      client_name: appointment.name,
      client_email: appointment.email,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      status: statusLabel,
    },
    PUBLIC_KEY,
  );
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import { useLanguage } from "../context/LanguageContext";

const STATUS = {
  pending: { label: "Pending", cls: "badge-pending" },
  confirmed: { label: "Confirmed", cls: "badge-confirmed" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "appointments"),
      where("email", "==", user.email),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAppointments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false),
    );

    return unsubscribe;
  }, [user, navigate]);

  const today = new Date().toISOString().split("T")[0];

  const filtered = appointments.filter((a) => {
    if (filter === "upcoming")
      return a.date >= today && a.status !== "cancelled";
    if (filter === "past") return a.date < today;
    return true;
  });

  const formatSubmitted = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-inner">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← {t("back").toUpperCase()}
          </button>
          <div className="profile-logo">
            <span>✂</span>
            <span>{t("profile").toUpperCase()}</span>
          </div>
          <div />
        </div>
      </header>

      <main className="profile-main">
        {/* User card */}
        <div className="user-card">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              className="user-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {user?.displayName?.[0] ?? user?.email?.[0] ?? "?"}
            </div>
          )}
          <div className="user-info">
            {user?.displayName && (
              <h2 className="user-name">{user.displayName}</h2>
            )}
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        {/* Appointments */}
        <section className="appt-section">
          <div className="appt-section-header">
            <h3 className="appt-title">My Appointments</h3>
            <div className="appt-filters">
              {["all", "upcoming", "past"].map((f) => (
                <button
                  key={f}
                  className={`filter-pill ${filter === f ? "filter-pill--active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="appt-state">Loading…</p>
          ) : filtered.length === 0 ? (
            <div className="appt-empty">
              <span className="appt-empty-icon">✂</span>
              <p>No appointments found.</p>
              <button className="btn-book" onClick={() => navigate("/")}>
                Book now
              </button>
            </div>
          ) : (
            <div className="appt-list">
              {filtered.map((a) => (
                <div key={a.id} className={`appt-card appt-card--${a.status}`}>
                  <div className="appt-card-top">
                    <div className="appt-datetime">
                      <span className="appt-date">{a.date || "—"}</span>
                      {a.time && <span className="appt-time">{a.time}</span>}
                    </div>
                    <span
                      className={`badge ${STATUS[a.status]?.cls ?? "badge-pending"}`}
                    >
                      {STATUS[a.status]?.label ?? a.status}
                    </span>
                  </div>
                  <p className="appt-service">{a.service || "—"}</p>
                  {a.notes && <p className="appt-notes">"{a.notes}"</p>}
                  <p className="appt-submitted">
                    Submitted {formatSubmitted(a.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/appointments";
import "./Dashboard.css";

const STATUS = {
  pending: { label: "Pending", cls: "badge-pending" },
  confirmed: { label: "Confirmed", cls: "badge-confirmed" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
};

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAppointments(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, [isAdmin, navigate]);

  const today = new Date().toISOString().split("T")[0];

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    today: appointments.filter((a) => a.date === today).length,
  };

  const filtered = appointments.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatus = (id, status) => updateAppointmentStatus(id, status);

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    setConfirmDelete(null);
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dash">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-logo">
            <span>✂</span>
            <span>Admin Dashboard</span>
          </div>
          <div className="dash-user">
            {user?.photoURL && (
              <img src={user.photoURL} alt="avatar" className="dash-avatar" referrerPolicy="no-referrer" />
            )}
            <span className="dash-user-email">{user?.email}</span>
            <button
              className="dash-logout"
              onClick={() => logout().then(() => navigate("/"))}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-card--pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-card--confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-card stat-card--today">
            <span className="stat-value">{stats.today}</span>
            <span className="stat-label">Today</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="dash-toolbar">
          <div className="dash-filters">
            {["all", "pending", "confirmed", "cancelled"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "filter-btn--active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input
            className="dash-search"
            type="text"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="dash-loading">Loading appointments…</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">No appointments found.</div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>Submitted</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="td-datetime">
                      <span className="td-date">{a.date || "—"}</span>
                      <span className="td-time">{a.time || ""}</span>
                    </td>
                    <td className="td-submitted">{formatDate(a.createdAt)}</td>
                    <td className="td-name">{a.name}</td>
                    <td>{a.phone}</td>
                    <td className="td-email">{a.email}</td>
                    <td className="td-service">{a.service}</td>
                    <td className="td-notes">{a.notes || "—"}</td>
                    <td>
                      <span
                        className={`badge ${STATUS[a.status]?.cls ?? "badge-pending"}`}
                      >
                        {STATUS[a.status]?.label ?? a.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        {a.status !== "confirmed" && (
                          <button
                            className="action-btn action-btn--confirm"
                            onClick={() => handleStatus(a.id, "confirmed")}
                          >
                            Confirm
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button
                            className="action-btn action-btn--cancel"
                            onClick={() => handleStatus(a.id, "cancelled")}
                          >
                            Cancel
                          </button>
                        )}
                        {a.status === "cancelled" && (
                          <button
                            className="action-btn action-btn--restore"
                            onClick={() => handleStatus(a.id, "pending")}
                          >
                            Restore
                          </button>
                        )}
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => setConfirmDelete(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete appointment?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="action-btn action-btn--delete"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </button>
              <button
                className="filter-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

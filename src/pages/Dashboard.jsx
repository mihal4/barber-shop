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
import { useLanguage } from "../context/LanguageContext";

const STATUS_CLS = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  cancelled: "badge-cancelled",
};

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setAppointments(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
        setLoading(false);
      },
      () => setLoading(false),
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

  const handleStatus = (id, status, appointment) =>
    updateAppointmentStatus(id, status, appointment);

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
          <button className="back-btn" onClick={() => navigate("/")}>
            ← {t("back").toUpperCase()}
          </button>
          <div className="dash-user">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="avatar"
                className="dash-avatar"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="dash-user-email">{user?.email}</span>
          </div>
        </div>
      </header>

      <main className="dash-main">
        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="dashboard-stat-label">{t("dashTotal")}</span>
          </div>
          <div className="stat-card stat-card--pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="dashboard-stat-label">{t("statusPending")}</span>
          </div>
          <div className="stat-card stat-card--confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="dashboard-stat-label">{t("statusConfirmed")}</span>
          </div>
          <div className="stat-card stat-card--today">
            <span className="stat-value">{stats.today}</span>
            <span className="dashboard-stat-label">{t("dashToday")}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="dash-toolbar">
          <div className="dash-filters">
            {[
              ["all", t("filterAll")],
              ["pending", t("statusPending")],
              ["confirmed", t("statusConfirmed")],
              ["cancelled", t("statusCancelled")],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`filter-btn ${filter === val ? "filter-btn--active" : ""}`}
                onClick={() => setFilter(val)}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            className="dash-search"
            type="text"
            placeholder={t("dashSearch")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="dash-loading">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">{t("noAppointmentsFound")}</div>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>{t("dashDatetime")}</th>
                  <th>{t("submittedOn")}</th>
                  <th>{t("dashName")}</th>
                  <th>{t("dashPhone")}</th>
                  <th>{t("dashEmail")}</th>
                  <th>{t("dashService")}</th>
                  <th>{t("dashNotes")}</th>
                  <th>{t("dashStatus")}</th>
                  <th>{t("dashActions")}</th>
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
                        className={`badge ${STATUS_CLS[a.status] ?? "badge-pending"}`}
                      >
                        {t(
                          `status${a.status?.charAt(0).toUpperCase()}${a.status?.slice(1)}`,
                        ) || a.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        {a.status !== "confirmed" && (
                          <button
                            className="action-btn action-btn--confirm"
                            onClick={() => handleStatus(a.id, "confirmed", a)}
                          >
                            {t("dashConfirm")}
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button
                            className="action-btn action-btn--cancel"
                            onClick={() => handleStatus(a.id, "cancelled", a)}
                          >
                            {t("dashCancel")}
                          </button>
                        )}
                        {a.status === "cancelled" && (
                          <button
                            className="action-btn action-btn--restore"
                            onClick={() => handleStatus(a.id, "pending", a)}
                          >
                            {t("dashRestore")}
                          </button>
                        )}
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => setConfirmDelete(a.id)}
                        >
                          {t("dashDelete")}
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
            <h3>{t("dashDeleteTitle")}</h3>
            <p>{t("dashDeleteBody")}</p>
            <div className="modal-actions">
              <button
                className="action-btn action-btn--delete"
                onClick={() => handleDelete(confirmDelete)}
              >
                {t("dashDelete")}
              </button>
              <button
                className="filter-btn"
                onClick={() => setConfirmDelete(null)}
              >
                {t("dashCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

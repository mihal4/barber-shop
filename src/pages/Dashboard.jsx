import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "../services/appointments";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products";
import "./Dashboard.css";
import { useLanguage } from "../context/LanguageContext";

const EMPTY_PRODUCT = { name: "", description: "", price: "", category: "", inStock: true };

const STATUS_CLS = {
  pending: "badge-pending",
  confirmed: "badge-confirmed",
  cancelled: "badge-cancelled",
};

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("appointments");

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productModal, setProductModal] = useState(null); // { mode: 'add'|'edit', data: {} }
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [productSaving, setProductSaving] = useState(false);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

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

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setProductsLoading(false);
      },
      () => setProductsLoading(false),
    );
    return unsubscribe;
  }, [isAdmin]);

  const today = new Date().toISOString().split("T")[0];

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    today: appointments.filter((a) => a.date === today).length,
  };

  const filtered = appointments.filter((a) => {
    const isPast = a.date && a.date < today;
    if (filter === "past") {
      if (!isPast) return false;
    } else {
      if (isPast) return false;
      if (filter !== "all" && a.status !== filter) return false;
    }
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

  const formatAppointmentDate = (dateStr) => {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("sk-SK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  // Product handlers
  const openProductModal = (mode, data = EMPTY_PRODUCT) => {
    setProductForm({ ...data });
    setProductModal({ mode, data });
    setProductImageFile(null);
    setProductImagePreview(data.imageUrl || null);
  };

  const closeProductModal = () => {
    setProductModal(null);
    setProductForm(EMPTY_PRODUCT);
    setProductImageFile(null);
    setProductImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImageFile(file);
    setProductImagePreview(URL.createObjectURL(file));
  };

  const handleProductSave = async () => {
    setProductSaving(true);
    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: parseFloat(productForm.price) || 0,
      category: productForm.category.trim(),
      inStock: productForm.inStock,
    };
    if (productModal.mode === "add") {
      await addProduct(payload, productImageFile);
    } else {
      await updateProduct(productModal.data.id, payload, productImageFile, productModal.data.imageUrl);
    }
    setProductSaving(false);
    closeProductModal();
  };

  const handleDeleteProduct = async (id) => {
    const product = products.find((p) => p.id === id);
    await deleteProduct(id, product?.imageUrl);
    setConfirmDeleteProduct(null);
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

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            className={`dash-tab ${activeTab === "appointments" ? "dash-tab--active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            {t("tabAppointments")}
          </button>
          <button
            className={`dash-tab ${activeTab === "products" ? "dash-tab--active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            {t("tabProducts")}
          </button>
        </div>

        {/* Appointments tab */}
        {activeTab === "appointments" && (
          <>
            {/* Toolbar */}
            <div className="dash-toolbar">
              <div className="dash-filters">
                {[
                  ["all", t("filterAll")],
                  ["pending", t("statusPending")],
                  ["confirmed", t("statusConfirmed")],
                  ["cancelled", t("statusCancelled")],
                  ["past", t("filterPast")],
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
                        <td className="td-datetime" data-label={t("dashDatetime")}>
                          <span className="td-date">{formatAppointmentDate(a.date)}</span>
                          <span className="td-time">{a.time || ""}</span>
                        </td>
                        <td className="td-submitted" data-label={t("submittedOn")}>{formatDate(a.createdAt)}</td>
                        <td className="td-name" data-label={t("dashName")}>{a.name}</td>
                        <td data-label={t("dashPhone")}>{a.phone}</td>
                        <td className="td-email" data-label={t("dashEmail")}>{a.email}</td>
                        <td className="td-service" data-label={t("dashService")}>{a.service}</td>
                        <td className="td-notes" data-label={t("dashNotes")}>{a.notes || "—"}</td>
                        <td data-label={t("dashStatus")}>
                          <span
                            className={`badge ${STATUS_CLS[a.status] ?? "badge-pending"}`}
                          >
                            {t(
                              `status${a.status?.charAt(0).toUpperCase()}${a.status?.slice(1)}`,
                            ) || a.status}
                          </span>
                        </td>
                        <td data-label={t("dashActions")}>
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
          </>
        )}

        {/* Products tab */}
        {activeTab === "products" && (
          <>
            <div className="dash-toolbar">
              <div />
              <button
                className="action-btn action-btn--confirm"
                style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}
                onClick={() => openProductModal("add")}
              >
                + {t("addProduct")}
              </button>
            </div>

            {productsLoading ? (
              <div className="dash-loading">{t("loading")}</div>
            ) : products.length === 0 ? (
              <div className="dash-empty">{t("noAppointmentsFound")}</div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>{t("productName")}</th>
                      <th>{t("productDescription")}</th>
                      <th>{t("productPrice")}</th>
                      <th>{t("productCategory")}</th>
                      <th>{t("dashStatus")}</th>
                      <th>{t("dashActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="td-img">
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt={p.name} className="product-thumb" />
                            : <div className="product-thumb product-thumb--empty" />}
                        </td>
                        <td className="td-name" data-label={t("productName")}>{p.name}</td>
                        <td className="td-notes" data-label={t("productDescription")}>{p.description || "—"}</td>
                        <td data-label={t("productPrice")}>
                          {p.price != null ? `${Number(p.price).toFixed(2)} €` : "—"}
                        </td>
                        <td data-label={t("productCategory")}>{p.category || "—"}</td>
                        <td data-label={t("dashStatus")}>
                          <span className={`badge ${p.inStock ? "badge-confirmed" : "badge-cancelled"}`}>
                            {p.inStock ? t("inStock") : t("outOfStock")}
                          </span>
                        </td>
                        <td data-label={t("dashActions")}>
                          <div className="action-group">
                            <button
                              className="action-btn action-btn--restore"
                              onClick={() => openProductModal("edit", p)}
                            >
                              {t("editProduct")}
                            </button>
                            <button
                              className="action-btn action-btn--delete"
                              onClick={() => setConfirmDeleteProduct(p.id)}
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
          </>
        )}
      </main>

      {/* Delete appointment modal */}
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

      {/* Delete product modal */}
      {confirmDeleteProduct && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t("dashDeleteTitle")}</h3>
            <p>{t("dashDeleteBody")}</p>
            <div className="modal-actions">
              <button
                className="action-btn action-btn--delete"
                onClick={() => handleDeleteProduct(confirmDeleteProduct)}
              >
                {t("dashDelete")}
              </button>
              <button
                className="filter-btn"
                onClick={() => setConfirmDeleteProduct(null)}
              >
                {t("dashCancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit product modal */}
      {productModal && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal modal--product" onClick={(e) => e.stopPropagation()}>
            <h3>{productModal.mode === "add" ? t("addProduct") : t("editProduct")}</h3>

            <div className="product-form">
              <label className="product-label">
                {t("productImage")}
                <div className="product-image-picker">
                  {productImagePreview && (
                    <img src={productImagePreview} alt="preview" className="product-image-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="product-input"
                    onChange={handleImageChange}
                  />
                </div>
              </label>

              <label className="product-label">
                {t("productName")}
                <input
                  className="product-input"
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                />
              </label>

              <label className="product-label">
                {t("productDescription")}
                <textarea
                  className="product-input product-textarea"
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                />
              </label>

              <div className="product-form-row">
                <label className="product-label">
                  {t("productPrice")}
                  <input
                    className="product-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </label>

                <label className="product-label">
                  {t("productCategory")}
                  <input
                    className="product-input"
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </label>
              </div>

              <label className="product-label product-label--checkbox">
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm((f) => ({ ...f, inStock: e.target.checked }))}
                />
                {t("inStock")}
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="action-btn action-btn--confirm"
                onClick={handleProductSave}
                disabled={productSaving || !productForm.name.trim()}
              >
                {t("save")}
              </button>
              <button className="filter-btn" onClick={closeProductModal}>
                {t("dashCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

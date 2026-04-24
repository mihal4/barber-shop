// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { createAppointment } from "../services/appointments";
import "./Home.css";

function Home() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validationNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("validationNameMin");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("validationPhoneRequired");
    } else if (!/^[\d\s\+\-\(\)]{9,}$/.test(formData.phone.trim())) {
      newErrors.phone = t("validationPhoneInvalid");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validationEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t("validationEmailInvalid");
    }

    if (!formData.service) {
      newErrors.service = t("validationServiceRequired");
    }

    if (!formData.date) {
      newErrors.date = t("validationDateRequired");
    }

    if (!formData.time) {
      newErrors.time = t("validationTimeRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const result = await createAppointment({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
    } else {
      setSubmitStatus("error");
    }
  };

  return (
    <div className="home">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">✂</span>
          </div>

          <ul className={`nav-links${menuOpen ? " nav-links--open" : ""}`}>
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
                  setMenuOpen(false);
                }}
              >
                {t("navHome")}
              </a>
            </li>
            <li>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                  setMenuOpen(false);
                }}
              >
                {t("navServices")}
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("about");
                  setMenuOpen(false);
                }}
              >
                {t("navAbout")}
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("address");
                  setMenuOpen(false);
                }}
              >
                {t("navContact")}
              </a>
            </li>
            {user ? (
              <>
                {isAdmin && (
                  <li>
                    <a
                      href=""
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/dashboard");
                      }}
                    >
                      {t("dashboard")}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href=""
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    {t("profile")}
                  </a>
                </li>
                <li>
                  <button className="btn-sign-out" onClick={logout}>
                    {t("signOut")}
                  </button>
                </li>
              </>
            ) : (
              menuOpen && (
                <li>
                  <a href="" onClick={loginWithGoogle}>
                    {t("signIn")}
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="nav-right">
            {!user && (
              <button className="nav-cta-secondary" onClick={loginWithGoogle}>
                {t("signIn")}
              </button>
            )}
            <button
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                scrollToSection("contact");
              }}
            >
              {t("navBookNow")}
            </button>
            <button
              className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1
            dangerouslySetInnerHTML={{
              __html: t("heroTitle").replace("\n", "<br/>"),
            }}
          />
          <p>{t("heroSubtitle")}</p>
          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              {t("heroBookBtn")}
            </button>
            <button
              className="btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("services");
              }}
            >
              {t("heroServicesBtn")}
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">15+</span>
            <span className="stat-label">{t("yearsExp")}</span>
          </div>
          <div className="stat">
            <span className="stat-number">10k+</span>
            <span className="stat-label">{t("happyClients")}</span>
          </div>
          <div className="stat">
            <span className="stat-number">5★</span>
            <span className="stat-label">{t("rating")}</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-container">
          <h2 className="section-title">{t("ourServices")}</h2>
          <p className="section-subtitle">{t("servicesSubtitle")}</p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">✂</div>
              <h3>Pánsky strih</h3>
              <p>popis</p>
              <span className="service-price">13 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🪒</div>
              <h3>Pánsky strih - Fade</h3>
              <p>popis</p>
              <span className="service-price">15 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">💈</div>
              <h3>Pánsky strih + brada a umývanie</h3>
              <p>popis</p>
              <span className="service-price">23 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Detský strih</h3>
              <p>popis</p>
              <span className="service-price">10 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Strihanie krátkych vlasov</h3>
              <p>+ farbenie 28 €</p>
              <span className="service-price">20 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Strihanie polodlhé vlasov</h3>
              <p>+ farbenie 35 - 45 €</p>
              <span className="service-price">23 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Strihanie dlhých vlasov</h3>
              <p>+ farbenie 60 - 80 €</p>
              <span className="service-price">25 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Melír krátkych vlasov</h3>
              <p>Melír dlhých vlasov 60 €</p>
              <span className="service-price">30 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Boxerské vrkoče</h3>
              <p>popis</p>
              <span className="service-price">20 -30 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Účesy</h3>
              <p>popis</p>
              <span className="service-price">25 -35 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Denná úprava krátke vlasy</h3>
              <p>Denná úprava polodlhé 20 €</p>
              <p>Denná úprava dlhé 25 €</p>
              <span className="service-price">15 €</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">{t("ourStory")}</h2>
              <p>{t("aboutText1")}</p>
              <p>{t("aboutText2")}</p>

              <div className="about-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>{t("premiumProducts")}</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>{t("relaxingAtmosphere")}</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>{t("freeConsultations")}</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="placeholder-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Address Section */}
      <section id="address" className="hours">
        <div className="section-container">
          <div className="hours-grid">
            <div className="hours-card">
              <h3>{t("openingHours")}</h3>
              <ul className="hours-list">
                <li>
                  <span>{t("mondayFriday")}</span>
                  <span>9:00 - 16:00</span>
                </li>
                <li>
                  <span>{t("saturday")}</span>
                  <span>8:00 - 12:00</span>
                </li>
              </ul>
            </div>
            <div className="hours-card">
              <h3>{t("location")}</h3>
              <p>
                Letná 51 (v bráne)
                <br />
                Spišská Nová Ves
                <br />
                05201
              </p>
              <p className="phone">📞 (+421) 949 727 574</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-container">
          <h2 className="section-title">{t("bookAppointment")}</h2>
          <p className="section-subtitle">{t("contactSubtitle")}</p>

          <div className="contact-form">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder={t("yourName")}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t("phoneNumber")}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder={t("emailAddress")}
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div className="form-group">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={errors.service ? "input-error" : ""}
                >
                  <option value="">{t("selectService")}</option>
                  <option value="haircut">Pánsky strih: 13 €</option>
                  <option value="shave">Pánsky strih fade: 15 €</option>
                  <option value="beard">
                    Pánsky strih + brada a umývanie: 23 €
                  </option>
                  <option value="grooming">Detský strih: 10 €</option>
                  <option value="coloring">
                    Strihanie krátkych vlasov: 20 €
                  </option>
                  <option value="coloring">
                    Strihanie krátkych vlasov + farbenie: 28 €
                  </option>
                  <option value="coloring">
                    Strihanie polodlhých vlasov: 23 €
                  </option>
                  <option value="coloring">
                    Strihanie polodlhých vlasov + farbenie: 35 - 45 €
                  </option>
                  <option value="coloring">
                    Strihanie dlhých vlasov: 25 €
                  </option>
                  <option value="coloring">
                    Strihanie dlhých vlasov + farbenie: 60 - 80 €
                  </option>
                  <option value="coloring">Melír krátkých vlasov: 30 €</option>
                  <option value="coloring">Melír dlhých vlasov: 60 €</option>
                  <option value="coloring">Boxerské vrkoče: 20 - 30 €</option>
                  <option value="coloring">Účesy: 25 - 35 €</option>
                  <option value="coloring">
                    Denná úprava krátke vlasy: 15 €
                  </option>
                  <option value="coloring">
                    Denná úprava polodlhé vlasy: 20 €
                  </option>
                  <option value="coloring">
                    Denná úprava dlhé vlasy: 25 €
                  </option>
                </select>
                {errors.service && (
                  <span className="error-message">{errors.service}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={errors.date ? "input-error" : ""}
                  />
                  {errors.date && (
                    <span className="error-message">{errors.date}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={errors.time ? "input-error" : ""}
                  />
                  {errors.time && (
                    <span className="error-message">{errors.time}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <textarea
                  name="notes"
                  placeholder={t("additionalNotes")}
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              {submitStatus === "success" && (
                <div className="form-success">
                  ✓ {t("formSuccess") || "Objednávka bola úspešne odoslaná!"}
                </div>
              )}

              {submitStatus === "error" && (
                <div className="form-error">
                  ✗ {t("formError") || "Nastala chyba. Skúste znova."}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Odosielam..." : t("requestAppointment")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">✂</span>
            <span>Barber shop</span>
          </div>
          <p>© 2026 Barber shop. {t("allRightsReserved")}</p>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

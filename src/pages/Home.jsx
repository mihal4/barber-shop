// src/pages/Home.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { createAppointment, isSlotTaken, getTakenSlots } from "../services/appointments";
import "./Home.css";

const TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 30;
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

function Home() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    setError,
  } = useForm({ mode: "onTouched" });

  const watchedDate = watch("date");

  const [menuOpen, setMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const grid1Ref = useRef(null);
  const grid2Ref = useRef(null);
  const grid3Ref = useRef(null);
  const [activeDot1, setActiveDot1] = useState(0);
  const [activeDot2, setActiveDot2] = useState(0);
  const [activeDot3, setActiveDot3] = useState(0);

  const [products, setProducts] = useState([]);
  const [takenSlots, setTakenSlots] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  useEffect(() => {
    if (!watchedDate) { setTakenSlots([]); return; }
    getTakenSlots(watchedDate).then((slots) => {
      setTakenSlots(slots);
      if (slots.includes(watch("time"))) {
        setValue("time", "");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDate]);

  const makeScrollHandler = (ref, setActive, count) => () => {
    const el = ref.current;
    if (!el) return;
    const index = Math.min(
      Math.round(
        (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * (count - 1),
      ),
      count - 1,
    );
    setActive(isNaN(index) ? 0 : index);
  };

  const scrollToCard = (ref, index, count) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({
      left: (el.scrollWidth - el.clientWidth) * (index / (count - 1)),
      behavior: "smooth",
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSubmit = async (data) => {
    setSubmitStatus(null);

    const taken = await isSlotTaken(data.date, data.time);
    if (taken) {
      setError("time", { message: t("validationSlotTaken") });
      return;
    }

    const result = await createAppointment({
      name: data.name,
      phone: data.phone,
      email: data.email,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes || "",
    });

    if (result.success) {
      setSubmitStatus("success");
      reset();
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
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    {t("profile")}
                  </a>
                </li>
                {menuOpen && (
                  <li>
                    <a onClick={logout}>{t("signOut")}</a>
                  </li>
                )}
              </>
            ) : (
              menuOpen && (
                <li>
                  <a onClick={loginWithGoogle}>{t("signIn")}</a>
                </li>
              )
            )}
          </ul>

          <div className="nav-right">
            {!user ? (
              <button className="nav-cta-secondary" onClick={loginWithGoogle}>
                {t("signIn")}
              </button>
            ) : (
              <button className="nav-cta-secondary" onClick={logout}>
                {t("signOut")}
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
        <div className="hero-inner">
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
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-container">
          <h2 className="section-title">{t("ourServices")}</h2>
          <p className="section-subtitle">{t("servicesMenSubtitle")}</p>

          <div
            className="services-grid"
            ref={grid1Ref}
            onScroll={makeScrollHandler(grid1Ref, setActiveDot1, 4)}
          >
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
          </div>

          <div className="services-dots">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`services-dot ${activeDot1 === i ? "services-dot--active" : ""}`}
                onClick={() => scrollToCard(grid1Ref, i, 4)}
              />
            ))}
          </div>
        </div>

        <div className="section-container">
          <p className="section-subtitle">{t("servicesWomenSubtitle")}</p>

          <div
            className="services-grid"
            ref={grid2Ref}
            onScroll={makeScrollHandler(grid2Ref, setActiveDot2, 7)}
          >
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
              <span className="service-price">20 - 30 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Účesy</h3>
              <p>popis</p>
              <span className="service-price">25 - 35 €</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Denná úprava krátke vlasy</h3>
              <p>Denná úprava polodlhé 20 €</p>
              <p>Denná úprava dlhé 25 €</p>
              <span className="service-price">15 €</span>
            </div>
          </div>

          <div className="services-dots">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                className={`services-dot ${activeDot2 === i ? "services-dot--active" : ""}`}
                onClick={() => scrollToCard(grid2Ref, i, 7)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section id="products" className="products-section">
          <div className="section-container">
            <h2 className="section-title">{t("ourProducts")}</h2>
            <p className="section-subtitle">{t("ourProductsSubtitle")}</p>

            <div
              className="services-grid"
              ref={grid3Ref}
              onScroll={makeScrollHandler(
                grid3Ref,
                setActiveDot3,
                products.length,
              )}
            >
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="product-card-img"
                    />
                  ) : (
                    <div className="product-card-img product-card-img--empty" />
                  )}
                  <div className="product-card-body">
                    {p.category && (
                      <span className="product-card-category">
                        {p.category}
                      </span>
                    )}
                    <h3>{p.name}</h3>
                    {p.description && <p>{p.description}</p>}
                    <span className="service-price">
                      {p.price != null ? `${Number(p.price).toFixed(2)} €` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {products.length > 1 && (
              <div className="services-dots">
                {products.map((_, i) => (
                  <button
                    key={i}
                    className={`services-dot ${activeDot3 === i ? "services-dot--active" : ""}`}
                    onClick={() => scrollToCard(grid3Ref, i, products.length)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
                <li>
                  <span>{t("sunday")}</span>
                  <span>{t("closed")}</span>
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
            <form onSubmit={rhfHandleSubmit(onSubmit)} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder={t("yourName")}
                    className={errors.name ? "input-error" : ""}
                    {...register("name", {
                      required: t("validationNameRequired"),
                      minLength: { value: 2, message: t("validationNameMin") },
                    })}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    placeholder={t("phoneNumber")}
                    className={errors.phone ? "input-error" : ""}
                    {...register("phone", {
                      required: t("validationPhoneRequired"),
                      pattern: {
                        value: /^[\d\s+\-()]{9,}$/,
                        message: t("validationPhoneInvalid"),
                      },
                    })}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder={t("emailAddress")}
                  className={errors.email ? "input-error" : ""}
                  {...register("email", {
                    required: t("validationEmailRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("validationEmailInvalid"),
                    },
                  })}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>
              <div className="form-group">
                <select
                  className={errors.service ? "input-error" : ""}
                  {...register("service", {
                    required: t("validationServiceRequired"),
                  })}
                >
                  <option value="">{t("selectService")}</option>
                  <option value="Pánsky strih">Pánsky strih: 13 €</option>
                  <option value="Pánsky strih fade">
                    Pánsky strih fade: 15 €
                  </option>
                  <option value="Pánsky strih + brada a umývanie">
                    Pánsky strih + brada a umývanie: 23 €
                  </option>
                  <option value="Detský strih">Detský strih: 10 €</option>
                  <option value="Strihanie krátkych vlasov">
                    Strihanie krátkych vlasov: 20 €
                  </option>
                  <option value="Strihanie krátkych vlasov + farbenie">
                    Strihanie krátkych vlasov + farbenie: 28 €
                  </option>
                  <option value="Strihanie polodlhých vlasov">
                    Strihanie polodlhých vlasov: 23 €
                  </option>
                  <option value="Strihanie polodlhých vlasov + farbenie">
                    Strihanie polodlhých vlasov + farbenie: 35 - 45 €
                  </option>
                  <option value="Strihanie dlhých vlasov">
                    Strihanie dlhých vlasov: 25 €
                  </option>
                  <option value="Strihanie dlhých vlasov + farbenie">
                    Strihanie dlhých vlasov + farbenie: 60 - 80 €
                  </option>
                  <option value="Melír krátkých vlasov">
                    Melír krátkých vlasov: 30 €
                  </option>
                  <option value="Melír dlhých vlasov">
                    Melír dlhých vlasov: 60 €
                  </option>
                  <option value="Boxerské vrkoče">
                    Boxerské vrkoče: 20 - 30 €
                  </option>
                  <option value="Účesy">Účesy: 25 - 35 €</option>
                  <option value="Denná úprava krátke vlasy">
                    Denná úprava krátke vlasy: 15 €
                  </option>
                  <option value="Denná úprava polodlhé vlasy">
                    Denná úprava polodlhé vlasy: 20 €
                  </option>
                  <option value="Denná úprava dlhé vlasy">
                    Denná úprava dlhé vlasy: 25 €
                  </option>
                </select>
                {errors.service && (
                  <span className="error-message">{errors.service.message}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    className={errors.date ? "input-error" : ""}
                    {...register("date", {
                      required: t("validationDateRequired"),
                      validate: (value) => {
                        const [y, m, d] = value.split("-").map(Number);
                        return (
                          new Date(y, m - 1, d).getDay() !== 0 ||
                          t("validationNoSunday")
                        );
                      },
                    })}
                  />
                  {errors.date && (
                    <span className="error-message">{errors.date.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <select
                    className={errors.time ? "input-error" : ""}
                    disabled={!watchedDate}
                    {...register("time", {
                      required: t("validationTimeRequired"),
                    })}
                  >
                    <option value="">{t("selectTime")}</option>
                    {TIME_SLOTS.filter((slot) => !takenSlots.includes(slot)).map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <span className="error-message">{errors.time.message}</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <textarea
                  placeholder={t("additionalNotes")}
                  {...register("notes")}
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

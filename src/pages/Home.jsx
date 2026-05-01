// src/pages/Home.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  createAppointment,
  isSlotTaken,
  getTakenSlots,
} from "../services/appointments";
import "./Home.css";
import manHaircutImg from "../assets/man_haircut.png";
import fadeImg from "../assets/fade.png";
import fadeBeardImg from "../assets/fade_beard.png";
import fadeKidImg from "../assets/fade_kid.png";
import womanShortImg from "../assets/woman_short.png";
import womanSemiLongImg from "../assets/woman_semi_long.png";
import womanLongImg from "../assets/woman_long.png";
import womanHighShortImg from "../assets/woman_high_short.png";
import boxingImg from "../assets/boxing.png";
import womanBasicImg from "../assets/woman_basic.png";
import womanDailyImg from "../assets/woman_daily.png";

const MEN_SERVICES = [
  { img: manHaircutImg, title: "Pánsky strih", desc: "popis", price: "13 €" },
  { img: fadeImg, title: "Pánsky strih - Fade", desc: "popis", price: "15 €" },
  { img: fadeBeardImg, title: "Pánsky strih + brada a umývanie", desc: "popis", price: "23 €" },
  { img: fadeKidImg, title: "Detský strih", desc: "popis", price: "10 €" },
];

const WOMEN_SERVICES = [
  { img: womanShortImg, title: "Strihanie krátkych vlasov", desc: "+ farbenie 28 €", price: "20 €" },
  { img: womanSemiLongImg, title: "Strihanie polodlhé vlasov", desc: "+ farbenie 35 - 45 €", price: "23 €" },
  { img: womanLongImg, title: "Strihanie dlhých vlasov", desc: "+ farbenie 60 - 80 €", price: "25 €" },
  { img: womanHighShortImg, title: "Melír krátkych vlasov", desc: "Melír dlhých vlasov 60 €", price: "30 €" },
  { img: boxingImg, title: "Boxerské vrkoče", desc: null, price: "20 - 30 €" },
  { img: womanBasicImg, title: "Účesy", desc: null, price: "25 - 35 €" },
  { img: womanDailyImg, title: "Denná úprava krátke vlasy", desc: "Denná úprava polodlhé 20 € / dlhé 25 €", price: "15 €" },
];

const MEN_TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 30;
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const m = String(totalMinutes % 60).padStart(2, "0");
  return `${h}:${m}`;
});

const WOMEN_TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const h = String(8 + i).padStart(2, "0");
  return `${h}:00`;
});

const MEN_SERVICE_KEYS = new Set([
  "Pánsky strih",
  "Pánsky strih fade",
  "Pánsky strih + brada a umývanie",
  "Detský strih",
]);

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
  const watchedService = watch("service");
  const isMenService = MEN_SERVICE_KEYS.has(watchedService);
  const activeTimeSlots = watchedService
    ? isMenService ? MEN_TIME_SLOTS : WOMEN_TIME_SLOTS
    : [];

  const [menuOpen, setMenuOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const grid1Ref = useRef(null);
  const grid2Ref = useRef(null);
  const grid3Ref = useRef(null);
  const [activeDot1, setActiveDot1] = useState(0);
  const [activeDot2, setActiveDot2] = useState(0);
  const [activeDot3, setActiveDot3] = useState(0);

  const today = new Date().toLocaleDateString("en-CA");

  const isSaturday = watchedDate
    ? new Date(...watchedDate.split("-").map((n, i) => i === 1 ? +n - 1 : +n)).getDay() === 6
    : false;

  const isTooSoon = (timeStr) => {
    if (watchedDate !== today) return false;
    const [h, m] = timeStr.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);
    return slotTime.getTime() - Date.now() < 2 * 60 * 60 * 1000;
  };

  const [products, setProducts] = useState([]);
  const [takenSlots, setTakenSlots] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  useEffect(() => {
    if (!watchedDate) {
      setTakenSlots([]);
      return;
    }
    getTakenSlots(watchedDate).then((slots) => {
      setTakenSlots(slots);
      if (slots.includes(watch("time"))) {
        setValue("time", "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDate]);

  useEffect(() => {
    setValue("time", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenService]);

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

    if (isTooSoon(data.time)) {
      setError("time", { message: t("validationTooSoon") });
      return;
    }

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
          {/* <div className="hero-stats">
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
          </div> */}
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
            onScroll={makeScrollHandler(grid1Ref, setActiveDot1, MEN_SERVICES.length)}
          >
            {MEN_SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <img src={s.img} alt="" className="service-card-bg" />
                <div className="service-card-content">
                  <h3>{s.title}</h3>
                  {s.desc && <p>{s.desc}</p>}
                  <span className="service-price">{s.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="services-dots">
            {MEN_SERVICES.map((_, i) => (
              <button
                key={i}
                className={`services-dot ${activeDot1 === i ? "services-dot--active" : ""}`}
                onClick={() => scrollToCard(grid1Ref, i, MEN_SERVICES.length)}
              />
            ))}
          </div>
        </div>

        <div className="section-container">
          <p className="section-subtitle">{t("servicesWomenSubtitle")}</p>

          <div
            className="services-grid"
            ref={grid2Ref}
            onScroll={makeScrollHandler(grid2Ref, setActiveDot2, WOMEN_SERVICES.length)}
          >
            {WOMEN_SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <img src={s.img} alt="" className="service-card-bg" />
                <div className="service-card-content">
                  <h3>{s.title}</h3>
                  {s.desc && <p>{s.desc}</p>}
                  <span className="service-price">{s.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="services-dots">
            {WOMEN_SERVICES.map((_, i) => (
              <button
                key={i}
                className={`services-dot ${activeDot2 === i ? "services-dot--active" : ""}`}
                onClick={() => scrollToCard(grid2Ref, i, WOMEN_SERVICES.length)}
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
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt="" className="product-card-bg" />
                  )}
                  <div className="product-card-content">
                    {p.category && (
                      <span className="product-card-category">
                        {p.category}
                      </span>
                    )}
                    <h3>{p.name}</h3>
                    {p.description && <p>{p.description}</p>}
                    {p.price != null && (
                      <span className="service-price">
                        {Number(p.price).toFixed(2)} €
                      </span>
                    )}
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
              <p className="phone">📞 <a href="tel:+421949727574">(+421) 949 727 574</a></p>
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
                    <span className="error-message">
                      {errors.phone.message}
                    </span>
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
                  <span className="error-message">
                    {errors.service.message}
                  </span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    min={today}
                    className={errors.date ? "input-error" : ""}
                    {...register("date", {
                      required: t("validationDateRequired"),
                      onChange: (e) => {
                        const val = e.target.value;
                        if (val) {
                          const [y, m, d] = val.split("-").map(Number);
                          if (new Date(y, m - 1, d).getDay() === 0) {
                            setValue("date", "");
                            setValue("time", "");
                            setError("date", { message: t("validationNoSunday") });
                          }
                        }
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
                    disabled={!watchedDate || !watchedService}
                    {...register("time", {
                      required: t("validationTimeRequired"),
                    })}
                  >
                    <option value="">{t("selectTime")}</option>
                    {activeTimeSlots
                      .filter((slot) => !takenSlots.includes(slot) && !isTooSoon(slot) && (!isSaturday || slot <= "11:30"))
                      .map((slot) => (
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

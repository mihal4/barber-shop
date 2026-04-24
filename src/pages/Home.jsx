// src/pages/Home.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import "./Home.css";

function Home() {
  const { user } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">✂</span>
            <span className="logo-text">Barber shop</span>
          </div>
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("home");
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
                }}
              >
                {t("navContact")}
              </a>
            </li>
          </ul>
          <div className="nav-right">
            <button className="lang-toggle" onClick={toggleLanguage}>
              {language === "en" ? "SK" : "EN"}
            </button>
            <button
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              {t("navBookNow")}
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
            <button className="btn-primary">{t("heroBookBtn")}</button>
            <button className="btn-secondary">{t("heroServicesBtn")}</button>
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
              <h3>{t("haircut")}</h3>
              <p>{t("haircutDesc")}</p>
              <span className="service-price">$35</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🪒</div>
              <h3>{t("hotTowelShave")}</h3>
              <p>{t("hotTowelShaveDesc")}</p>
              <span className="service-price">$30</span>
            </div>

            <div className="service-card">
              <div className="service-icon">💈</div>
              <h3>{t("beardTrim")}</h3>
              <p>{t("beardTrimDesc")}</p>
              <span className="service-price">$25</span>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>{t("fullGrooming")}</h3>
              <p>{t("fullGroomingDesc")}</p>
              <span className="service-price">$75</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>{t("hairColoring")}</h3>
              <p>{t("hairColoringDesc")}</p>
              <span className="service-price">$60+</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>{t("seniorCut")}</h3>
              <p>{t("seniorCutDesc")}</p>
              <span className="service-price">$28</span>
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
              <div className="placeholder-image">
                <span>Barber Shop Image</span>
              </div>
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
                  <span>{t("monday")}</span>
                  <span>{t("closed")}</span>
                </li>
                <li>
                  <span>{t("tuesdayFriday")}</span>
                  <span>9:00 - 19:00</span>
                </li>
                <li>
                  <span>{t("saturday")}</span>
                  <span>9:00 - 17:00</span>
                </li>
                <li>
                  <span>{t("sunday")}</span>
                  <span>10:00 - 16:00</span>
                </li>
              </ul>
            </div>
            <div className="hours-card">
              <h3>{t("location")}</h3>
              <p>
                123 Main Street
                <br />
                Downtown District
                <br />
                City, State 12345
              </p>
              <p className="phone">📞 (555) 123-4567</p>
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
            <form>
              <div className="form-row">
                <input type="text" placeholder={t("yourName")} />
                <input type="tel" placeholder={t("phoneNumber")} />
              </div>
              <input type="email" placeholder={t("emailAddress")} />
              <select>
                <option value="">{t("selectService")}</option>
                <option value="haircut">{t("haircut")} - $35</option>
                <option value="shave">{t("hotTowelShave")} - $30</option>
                <option value="beard">{t("beardTrim")} - $25</option>
                <option value="grooming">{t("fullGrooming")} - $75</option>
                <option value="coloring">{t("hairColoring")} - $60+</option>
              </select>
              <input type="date" />
              <textarea placeholder={t("additionalNotes")}></textarea>
              <button type="submit" className="btn-primary">
                {t("requestAppointment")}
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
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

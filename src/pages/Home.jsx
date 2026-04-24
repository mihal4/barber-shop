// src/pages/Home.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

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
            <span className="logo-text">Gentleman's Cut</span>
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
                Home
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
                Services
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
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Contact
              </a>
            </li>
          </ul>
          <button className="nav-cta">Book Now</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>
            Classic Cuts.
            <br />
            Modern Style.
          </h1>
          <p>
            Where tradition meets sophistication. Experience the art of grooming
            at its finest.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Book Appointment</button>
            <button className="btn-secondary">View Services</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Happy Clients</span>
          </div>
          <div className="stat">
            <span className="stat-number">5★</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Premium grooming services tailored to your style
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">✂</div>
              <h3>Haircut</h3>
              <p>
                Classic fades, pompadours, and modern styles tailored to your
                face shape
              </p>
              <span className="service-price">$35</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🪒</div>
              <h3>Hot Towel Shave</h3>
              <p>
                Traditional straight razor shave with warm towels and premium
                products
              </p>
              <span className="service-price">$30</span>
            </div>

            <div className="service-card">
              <div className="service-icon">💈</div>
              <h3>Beard Trim</h3>
              <p>
                Precision beard shaping and trimming to complement your haircut
              </p>
              <span className="service-price">$25</span>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Full Grooming</h3>
              <p>
                Complete package: haircut, shave, beard trim, and facial massage
              </p>
              <span className="service-price">$75</span>
            </div>

            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Hair Coloring</h3>
              <p>
                Professional color services including gray coverage and
                highlights
              </p>
              <span className="service-price">$60+</span>
            </div>

            <div className="service-card">
              <div className="service-icon">👔</div>
              <h3>Senior Cut</h3>
              <p>
                Classic styles for distinguished gentlemen with discounted rates
              </p>
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
              <h2 className="section-title">Our Story</h2>
              <p>
                Founded in 2010, Gentleman's Cut has been the premier
                destination for discerning gentlemen who appreciate the art of
                traditional barbering combined with modern techniques.
              </p>
              <p>
                Our master barbers bring decades of experience and a passion for
                perfection to every cut. We believe that a great haircut is more
                than just a service—it's a transformation.
              </p>

              <div className="about-features">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Premium products only</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Relaxing atmosphere</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>Free consultations</span>
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

      {/* Hours Section */}
      <section className="hours">
        <div className="section-container">
          <div className="hours-grid">
            <div className="hours-card">
              <h3>Opening Hours</h3>
              <ul className="hours-list">
                <li>
                  <span>Monday</span>
                  <span>Closed</span>
                </li>
                <li>
                  <span>Tuesday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li>
                  <span>Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li>
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
              </ul>
            </div>
            <div className="hours-card">
              <h3>Location</h3>
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
          <h2 className="section-title">Book Your Appointment</h2>
          <p className="section-subtitle">
            Walk-ins welcome, appointments recommended
          </p>

          <div className="contact-form">
            <form>
              <div className="form-row">
                <input type="text" placeholder="Your Name" />
                <input type="tel" placeholder="Phone Number" />
              </div>
              <input type="email" placeholder="Email Address" />
              <select>
                <option value="">Select Service</option>
                <option value="haircut">Haircut - $35</option>
                <option value="shave">Hot Towel Shave - $30</option>
                <option value="beard">Beard Trim - $25</option>
                <option value="grooming">Full Grooming - $75</option>
                <option value="coloring">Hair Coloring - $60+</option>
              </select>
              <input type="date" />
              <textarea placeholder="Additional notes or special requests"></textarea>
              <button type="submit" className="btn-primary">
                Request Appointment
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
            <span>Gentleman's Cut</span>
          </div>
          <p>© 2026 Gentleman's Cut. All rights reserved.</p>
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

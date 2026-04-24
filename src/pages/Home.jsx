// src/pages/Home.jsx
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <header className="home-header">
        <h1>Barber Shop</h1>
        <p>Premium grooming services</p>
      </header>

      <main className="home-content">
        <section className="hero">
          <h2>Welcome to Our Shop</h2>
          <p>Professional haircuts and grooming services</p>
        </section>

        {user ? (
          <div className="user-info">
            <p>
              Logged in as: <strong>{user.email}</strong>
            </p>
          </div>
        ) : (
          <div className="auth-prompt">
            <p>Please log in to book an appointment</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

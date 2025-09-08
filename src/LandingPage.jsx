
import "./styles/LandingPage.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="hero">
        <h1 className="hero-title">Welcome to BlogSphere</h1>
        <p className="hero-subtitle">
          Share your thoughts, ideas, and stories with the world.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </header>

      <section className="features">
        <div className="feature">
          <h2>✍️ Create</h2>
          <p>Write blogs with a rich editor and publish instantly.</p>
        </div>
        <div className="feature">
          <h2>🌍 Connect</h2>
          <p>Discover blogs from other users and grow together.</p>
        </div>
        <div className="feature">
          <h2>💬 Engage</h2>
          <p>Like, comment, and reply to keep conversations alive.</p>
        </div>
      </section>
    </div>
  );
}

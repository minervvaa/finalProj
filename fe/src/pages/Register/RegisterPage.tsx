// RegisterPage.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./RegisterPage.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await register(firstName, lastName, email, password);
      nav("/vacations");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <section className="register-page">
      <div className="register-blob">
        <div className="register-blob-inner">
          {/* TEXT */}
          <h1>Create Account</h1>
          <p>start exploring destinations.</p>

          {/* FORM */}
          <form className="register-form" onSubmit={handleSubmit}>
            {/* FIRST NAME */}
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* LAST NAME */}
            <div className="input-with-icon">
              <i className="bi bi-person"></i>
              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="input-with-icon">
              <i className="bi bi-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="input-with-icon">
              <i className="bi bi-lock"></i>
              <input
                type="password"
                placeholder="Password (min 4)"
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error">{error}</div>}

            {/* BUTTON */}
            <button className="primary-btn" type="submit">
              SIGN UP
            </button>

            <div className="bottom-links">
              <span>Already have an account?</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => nav("/login")}
              >
                Sing in
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

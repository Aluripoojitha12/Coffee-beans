import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import heroSide from "../assets/hero1.jpg";       // desktop/tablet left image
import mobileImg from "../assets/beansbg_mbl3.jpg"; // mobile-specific image

// ---------- Validation helpers ----------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex  = /^[A-Za-z][A-Za-z\s'-]{1,49}$/; // 2–50, letters/spaces/hyphen/apostrophe
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/; // lower, upper, digit, special

function validateLogin(values: { email: string; password: string }) {
  const errors: Record<string, string> = {};
  const email = values.email.trim();
  const password = values.password;

  if (!email) errors.email = "Email is required.";
  else if (!emailRegex.test(email) || email.length > 254)
    errors.email = "Enter a valid email (max 254 characters).";

  if (!password) errors.password = "Password is required.";
  else if (password.length < 8 || password.length > 128)
    errors.password = "Password must be 8–128 characters.";

  return errors;
}

function validateSignup(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const errors: Record<string, string> = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!fullName) errors.fullName = "Full Name is required.";
  else if (!nameRegex.test(fullName))
    errors.fullName = "Use 2–50 letters, spaces, hyphen, apostrophe only.";

  if (!email) errors.email = "Email is required.";
  else if (!emailRegex.test(email) || email.length > 254)
    errors.email = "Enter a valid email (max 254).";

  if (!password) errors.password = "Password is required.";
  else if (!strongPasswordRegex.test(password))
    errors.password = "8–64 chars, include upper, lower, digit & special.";

  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password)
    errors.confirmPassword = "Passwords must match.";

  return errors;
}

// ---------- "JSON backend" using localStorage ----------
type StoredUser = {
  id: string;
  fullName: string;          // optional for login users created earlier
  email: string;             // original-case email
  emailLower: string;        // compare by lowercase
  password: string;          // demo only (plaintext). Replace with hash in real app.
  createdAt: string;
};

const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session";

// Read all users
function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

// Write all users
function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Find by email (case-insensitive)
function findUserByEmail(email: string): StoredUser | undefined {
  const users = loadUsers();
  const target = email.trim().toLowerCase();
  return users.find((u) => u.emailLower === target);
}

// Create user
function createUser(fullName: string, email: string, password: string): StoredUser {
  const user: StoredUser = {
    id: cryptoRandomId(),
    fullName,
    email,
    emailLower: email.trim().toLowerCase(),
    password, // DEMO ONLY
    createdAt: new Date().toISOString(),
  };
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

// Simple random id
function cryptoRandomId() {
  if ("randomUUID" in crypto) return (crypto as any).randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Create a "session"
function startSession(user: StoredUser) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      startedAt: Date.now(),
    })
  );
}

// ---------- Component ----------
const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login
  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginMessage, setLoginMessage] = useState("");

  // Signup
  const [signupValues, setSignupValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupMessage, setSignupMessage] = useState("");

  // ----- Submit handlers -----
  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage("");
    const errs = validateLogin(loginValues);
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const user = findUserByEmail(loginValues.email);
    if (!user || user.password !== loginValues.password) {
      setLoginErrors({
        email: !user ? "Account not found. Try signing up." : "",
        password: user ? "Incorrect password." : "",
      });
      return;
    }

    startSession(user);
    setLoginMessage("✅ Logged in successfully! Redirecting…");
    setTimeout(() => navigate("/"), 900);
  };

  const onSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMessage("");
    const errs = validateSignup(signupValues);

    // Email uniqueness
    const existing = findUserByEmail(signupValues.email);
    if (!errs.email && existing) {
      errs.email = "This email already exists. Try logging in.";
    }

    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newUser = createUser(
      signupValues.fullName.trim(),
      signupValues.email.trim(),
      signupValues.password
    );
    startSession(newUser);
    setSignupMessage("✅ Account created! Redirecting…");
    setTimeout(() => navigate("/"), 900);
  };

  // Mobile background image is passed to CSS via variable
  return (
    <main className="auth-page">
      <section
        className="auth-card auth-grid"
        style={{ ["--mobile-auth-bg" as any]: `url(${mobileImg})` }}
      >
        {/* Left visual (desktop/tablet) */}
        <div
          className="auth-visual auth-visual-bg"
          style={{ backgroundImage: `url(${heroSide})` }}
        />

        {/* Right: forms */}
        <div className="auth-panel">
          <h1 className="auth-title">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h1>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={`auth-tab ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {tab === "login" ? (
            <form className="auth-form" onSubmit={onLoginSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={loginValues.email}
                  maxLength={254}
                  onChange={(e) =>
                    setLoginValues((v) => ({ ...v, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                />
                {loginErrors.email && <p className="error">{loginErrors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={loginValues.password}
                  minLength={8}
                  maxLength={128}
                  onChange={(e) =>
                    setLoginValues((v) => ({ ...v, password: e.target.value }))
                  }
                  placeholder="********"
                  required
                />
                {loginErrors.password && (
                  <p className="error">{loginErrors.password}</p>
                )}
              </div>

              <button className="submit-btn" type="submit">Log In</button>
              {loginMessage && <p className="success">{loginMessage}</p>}
            </form>
          ) : (
            <form className="auth-form" onSubmit={onSignupSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="full-name">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  value={signupValues.fullName}
                  onChange={(e) =>
                    setSignupValues((v) => ({ ...v, fullName: e.target.value }))
                  }
                  placeholder="Jane O'Connor-Smith"
                  required
                />
                {signupErrors.fullName && (
                  <p className="error">{signupErrors.fullName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  value={signupValues.email}
                  maxLength={254}
                  onChange={(e) =>
                    setSignupValues((v) => ({ ...v, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                />
                {signupErrors.email && <p className="error">{signupErrors.email}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  value={signupValues.password}
                  onChange={(e) =>
                    setSignupValues((v) => ({ ...v, password: e.target.value }))
                  }
                  placeholder="********"
                  required
                />
                <p className="hint">
                  8–64 chars, include upper, lower, digit & special.
                </p>
                {signupErrors.password && (
                  <p className="error">{signupErrors.password}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={signupValues.confirmPassword}
                  onChange={(e) =>
                    setSignupValues((v) => ({
                      ...v,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="********"
                  required
                />
                {signupErrors.confirmPassword && (
                  <p className="error">{signupErrors.confirmPassword}</p>
                )}
              </div>

              <button className="submit-btn" type="submit">Create Account</button>
              {signupMessage && <p className="success">{signupMessage}</p>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Auth;

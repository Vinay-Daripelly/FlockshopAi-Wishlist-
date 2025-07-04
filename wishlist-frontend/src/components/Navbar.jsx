import { auth } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const logout = async (setLoggingOut, navigate) => {
  try {
    setLoggingOut(true);
    await auth.signOut();
    setTimeout(() => {
      alert("Successfully logged out.");
      navigate("/");
    }, 500); // allow time for state update
  } catch (e) {
    alert("Error logging out: " + e.message);
    setLoggingOut(false);
  }
};

export default function Navbar() {
  const [user, setUser] = useState(auth.currentUser);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // track auth state in real time
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <Link to="/dashboard" className="navbar-brand">
        Wishlist App
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {user && (
          <span className="text-white me-3 small">
            Hello, <b>{user.email}</b>
          </span>
        )}
        <button
          className="btn btn-outline-light btn-sm"
          disabled={loggingOut}
          onClick={() => logout(setLoggingOut, navigate)}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
}

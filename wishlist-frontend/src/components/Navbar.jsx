import { auth } from "../services/firebase";
import { Link } from "react-router-dom";

export const logout = async () => {
  await auth.signOut();
  window.location.href = "/";
};

export default function Navbar() {
  const user = auth.currentUser;

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
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

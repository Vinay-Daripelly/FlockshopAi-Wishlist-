import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const nav = useNavigate();

  const signup = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email, pwd);
      nav("/dashboard");
    } catch (e) {
      setErrorMsg("Signup failed. Try again.");
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="mb-3 text-center">Create Your Account</h3>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            placeholder="Enter your email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Create a password"
            value={pwd}
            disabled={loading}
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-1 text-center">{errorMsg}</div>
        )}

        <button className="btn btn-success w-100" onClick={signup} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

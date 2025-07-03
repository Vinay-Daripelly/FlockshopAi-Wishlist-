import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import {Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pwd);
    } catch (e) {
      alert(e.message);
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
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        <button className="btn btn-success w-100" onClick={signup}>
          Sign Up
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

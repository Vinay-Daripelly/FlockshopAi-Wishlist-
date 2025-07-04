// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../services/firebase";
// import { Link } from "react-router-dom";
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [pwd, setPwd] = useState("");
//   const login = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, pwd);
//     } catch (e) {
//       alert(e.message);
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
//         <h3 className="mb-3 text-center">Login to Wishlist App</h3>
//         <div className="mb-3">
//           <label className="form-label">Email</label>
//           <input
//             className="form-control"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Password</label>
//           <input
//             className="form-control"
//             type="password"
//             placeholder="Enter your password"
//             value={pwd}
//             onChange={(e) => setPwd(e.target.value)}
//           />
//         </div>

//         <button className="btn btn-primary w-100" onClick={login}>
//           Login
//         </button>

//         <p className="mt-3 text-center">
//           New user?{" "}
//           <Link to="/signup" className="text-decoration-none">
//             Create account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  const login = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      nav("/dashboard");
    } catch (e) {
      setErrorMsg("Invalid email or password");
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="mb-3 text-center">Login to Wishlist App</h3>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            disabled={loading}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={pwd}
            disabled={loading}
            placeholder="Enter your password"
            onChange={(e) => setPwd(e.target.value)}
          />
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-1 text-center">{errorMsg}</div>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={login}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-3 text-center">
          New user?{" "}
          <Link to="/signup" className="text-decoration-none">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

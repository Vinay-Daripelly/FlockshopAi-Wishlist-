import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  createWishlist,
  getWishlistsByUser,
  addCollaborator,
  updateCollaboratorRole,
  removeCollaborator,
} from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  /* ───────── state ───────── */
  const [wishlists, setWishlists] = useState([]);
  const [name, setName] = useState("");

  /* collaborator‑modal state */
  const [selected, setSelected] = useState(null);      // wishlist object
  const [collabEmail, setCollabEmail] = useState("");
  const [collabRole, setCollabRole] = useState("viewer");

  /* ───────── helpers ───────── */
  const refreshWishlists = async () => {
    const list = await getWishlistsByUser(auth.currentUser.email);
    setWishlists(list);
  };

  const addWishlist = async () => {
    if (!name.trim()) return;
    const id = await createWishlist({
      name: name.trim(),
      createdBy: auth.currentUser.email,
      roles: { [auth.currentUser.email]: "owner" },
    });
    setName("");
    refreshWishlists();
  };

  /* collaborator actions */
  const handleAddCollaborator = async () => {
    if (!collabEmail.trim() || !selected) return;
    await addCollaborator(selected.id, collabEmail.trim(), collabRole);
    setCollabEmail("");
    setCollabRole("viewer");
    refreshWishlists();
  };

  const handleRoleChange = async (email, role) => {
    await updateCollaboratorRole(selected.id, email, role);
    refreshWishlists();
  };

  const handleRemove = async (email) => {
    await removeCollaborator(selected.id, email);
    refreshWishlists();
  };

  /* ───────── load once ───────── */
  useEffect(() => {
    refreshWishlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────── ui ───────── */
  return (
    <div>
      <Navbar />

      <div className="container py-4">
        {/* create form */}
        <h3 className="mb-4">Create Wishlist</h3>
        <div className="row g-2 align-items-end mb-4">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Wishlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={addWishlist}>
              Create
            </button>
          </div>
        </div>

        {/* list */}
        <h4 className="mb-3">Your Wishlists</h4>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {wishlists.map((w) => (
            <div className="col" key={w.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{w.name}</h5>
                  <p className="text-muted mb-1">
                    {w.items?.length || 0} items
                  </p>
                  {w.roles && (
                    <p className="small text-muted mb-2">
                      Owner:&nbsp;
                      {
                        Object.entries(w.roles).find(
                          ([, role]) => role === "owner"
                        )?.[0]
                      }
                    </p>
                  )}

                  <div className="mt-auto d-flex justify-content-between">
                    <Link
                      to={`/wishlist/${w.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Open
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/wishlist/${w.id}`
                        )
                      }
                    >
                      Copy Link
                    </button>

                    <button
                      className="btn btn-sm btn-outline-dark"
                      data-bs-toggle="modal"
                      data-bs-target="#collabModal"
                      onClick={() => setSelected(w)}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Collaborator Modal ───── */}
      <div className="modal fade" id="collabModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Collaborators – {selected?.name || ""}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {/* existing */}
              {selected?.roles &&
                Object.entries(selected.roles).map(([email, role]) => (
                  <div
                    className="d-flex align-items-center mb-2"
                    key={email}
                  >
                    <span className="me-2">{email}</span>
                    <select
                      className="form-select form-select-sm me-2"
                      style={{ width: 120 }}
                      value={role}
                      disabled={role === "owner"}
                      onChange={(e) => handleRoleChange(email, e.target.value)}
                    >
                      <option value="owner">owner</option>
                      <option value="editor">editor</option>
                      <option value="viewer">viewer</option>
                    </select>
                    {role !== "owner" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(email)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}

              <hr />
              {/* add new */}
              <h6>Add collaborator</h6>
              <input
                className="form-control mb-2"
                placeholder="email@domain.com"
                value={collabEmail}
                onChange={(e) => setCollabEmail(e.target.value)}
              />
              <select
                className="form-select mb-3"
                value={collabRole}
                onChange={(e) => setCollabRole(e.target.value)}
              >
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>

              <button
                className="btn btn-primary w-100"
                onClick={handleAddCollaborator}
              >
                Add collaborator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


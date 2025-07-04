import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  createWishlist,
  getWishlistsByUser,
  addCollaborator,
  updateCollaboratorRole,
  removeCollaborator,
  renameWishlist,     
  deleteWishlist 
} from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  /* ───────── state ───────── */
  const [wishlists, setWishlists] = useState([]);
  const [name, setName]              = useState("");
  const [loading, setLoading]        = useState(true);  // initial fetch
  const [creating, setCreating]      = useState(false); // create in‑progress
  const [alert, setAlert]            = useState({ type: "", msg: "" });
  const [editName, setEditName] = useState({});
const [renameBusy, setRenameBusy] = useState(false);


  /* collaborator modal state */
  const [selected, setSelected]      = useState(null);
  const [collabEmail, setCollabEmail]= useState("");
  const [collabRole, setCollabRole]  = useState("viewer");
  const [collabBusy, setCollabBusy] = useState(false);
  const [collabAlert, setCollabAlert] = useState(null);

  /* ───────── helpers ───────── */
 const refreshWishlists = async () => {
  try {
    setLoading(true);
    const list = await getWishlistsByUser(auth.currentUser.email);
    setWishlists(list);

    if (selected) {
      const updated = list.find((w) => w.id === selected.id);
      if (JSON.stringify(updated) !== JSON.stringify(selected)) {
        setSelected(updated);
      }
    }
  } catch (e) {
    console.error("Failed to load wishlists", e);
  } finally {
    setLoading(false);
  }
};



  const addWishlist = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setAlert({ type: "", msg: "" });
    try {
      await createWishlist({
        name: name.trim(),
        createdBy: auth.currentUser.email,
        roles: { [auth.currentUser.email]: "owner" },
      });
      setAlert({ type: "success", msg: "Wishlist created successfully!" });
      setName("");
      refreshWishlists();
    } catch (e) {
      setAlert({ type: "danger", msg: "Could not create wishlist." });
    } finally {
      setCreating(false);
    }
  };

  /* collaborator actions (unchanged) */
  const handleAddCollaborator = async () => {
  if (!collabEmail.trim() || !selected) return;
  setCollabBusy(true);
  setCollabAlert(null);
  try {
    await addCollaborator(selected.id, collabEmail.trim(), collabRole);
    setCollabAlert({ type: "success", msg: "Collaborator added!" });
    setCollabEmail("");
    setCollabRole("viewer");
    refreshWishlists();
  } catch {
    setCollabAlert({ type: "danger", msg: "Failed to add collaborator." });
  } finally {
    setCollabBusy(false);
  }
};

  const handleRoleChange = async (email, role) => {
  setCollabBusy(true);
  setCollabAlert(null);
  try {
    await updateCollaboratorRole(selected.id, email, role);
    setCollabAlert({ type: "success", msg: "Role updated!" });
    refreshWishlists();
  } catch {
    setCollabAlert({ type: "danger", msg: "Failed to update role." });
  } finally {
    setCollabBusy(false);
  }
};

  const handleRemove = async (email) => {
  setCollabBusy(true);
  setCollabAlert(null);
  try {
    await removeCollaborator(selected.id, email);
    setCollabAlert({ type: "success", msg: "Removed collaborator." });
    refreshWishlists();
  } catch {
    setCollabAlert({ type: "danger", msg: "Failed to remove collaborator." });
  } finally {
    setCollabBusy(false);
  }
};
const handleRename = async (id) => {
  if (!editName[id]?.trim()) return;
  setRenameBusy(true);
  try {
    await renameWishlist(id, editName[id].trim());
    setAlert({ type: "success", msg: "Wishlist renamed!" });
    refreshWishlists();
    setEditName((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  } catch {
    setAlert({ type: "danger", msg: "Rename failed!" });
  } finally {
    setRenameBusy(false);
  }
};


const handleDelete = async (id) => {
  if (!window.confirm("Delete this wishlist?")) return;
  try {
    await deleteWishlist(id);
    setAlert({ type: "success", msg: "Wishlist deleted!" });
    refreshWishlists();
  } catch {
    setAlert({ type: "danger", msg: "Delete failed!" });
  }
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

        {/* alerts */}
        {alert.msg && (
          <div className={`alert alert-${alert.type} text-center`} role="alert">
            {alert.msg}
          </div>
        )}

        {/* create form */}
        <h3 className="mb-4">Create Wishlist</h3>
        <div className="row g-2 align-items-end mb-4">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Wishlist name"
              value={name}
              disabled={creating}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={addWishlist}
              disabled={creating}
            >
              {creating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>

        {/* list */}
        <h4 className="mb-3">Your Wishlists</h4>

        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border" role="status" /> Loading your wishlists…
          </div>
        ) : wishlists.length === 0 ? (
          <div className="text-center text-muted py-5">
            You have no wishlists yet – create one above.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {wishlists.map((w) => (
              <div className="col" key={w.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    {/* <h5 className="card-title">{w.name}</h5> */}
                    {editName[w.id] !== undefined ? (
  <>
    <input
      className="form-control form-control-sm mb-2"
      value={editName[w.id]}
      onChange={(e) =>
        setEditName({ ...editName, [w.id]: e.target.value })
      }
      disabled={renameBusy}
    />
    <button
      className="btn btn-sm btn-primary me-2"
      onClick={() => handleRename(w.id)}
      disabled={renameBusy}
    >
      Save
    </button>
    <button
      className="btn btn-sm btn-secondary"
      onClick={() => setEditName((prev) => {
        const copy = { ...prev };
        delete copy[w.id];
        return copy;
      })}
      disabled={renameBusy}
    >
      Cancel
    </button>
  </>
) : (
  <div className="d-flex justify-content-between">
    <h5 className="card-title mb-0">{w.name}</h5>
    <div className="dropdown">
      <button
        className="btn btn-sm btn-outline-dark dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        ⋮
      </button>
      <ul className="dropdown-menu">
        <li>
          <button
            className="dropdown-item"
            onClick={() =>
              setEditName((prev) => ({ ...prev, [w.id]: w.name }))
            }
          >
            Rename
          </button>
        </li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={() => handleDelete(w.id)}
          >
            Delete
          </button>
        </li>
      </ul>
    </div>
  </div>
)}

                    <p className="text-muted mb-1">
                      {w.items?.length || 0} items
                    </p>
                    {w.roles && (
                      <p className="small text-muted mb-2">
                        Owner:&nbsp;
                        {Object.entries(w.roles).find(([, r]) => r === "owner")?.[0]}
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
        )}
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
              {/* local alert state */}
              {collabAlert && (
                <div className={`alert alert-${collabAlert.type}`} role="alert">
                  {collabAlert.msg}
                </div>
              )}

              {/* existing collaborators */}
              {selected?.roles &&
                Object.entries(selected.roles).map(([email, role]) => (
                  <div className="d-flex align-items-center mb-2" key={email}>
                    <span className="me-2">{email}</span>
                    <select
                      className="form-select form-select-sm me-2"
                      style={{ width: 120 }}
                      value={role}
                      disabled={role === "owner" || collabBusy}
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
                        disabled={collabBusy}
                      >
                        {collabBusy ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          "×"
                        )}
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
                disabled={collabBusy}
              />
              <select
                className="form-select mb-3"
                value={collabRole}
                onChange={(e) => setCollabRole(e.target.value)}
                disabled={collabBusy}
              >
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>

              <button
                className="btn btn-primary w-100"
                onClick={handleAddCollaborator}
                disabled={collabBusy}
              >
                {collabBusy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : (
                  "Add collaborator"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

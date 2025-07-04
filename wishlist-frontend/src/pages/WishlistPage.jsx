import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getWishlist, addItem, deleteItem } from "../services/api";
import Navbar from "../components/Navbar";
import DummyProductList from "../components/DummyProductList";

export default function WishlistPage() {
  const { id } = useParams();

  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading]   = useState(true);      // fetch spinner
  const [busy, setBusy]         = useState(false);     // add/remove spinner
  const [alert, setAlert]       = useState(null);      // {type,msg}

  const [manualItem, setManualItem] = useState({
    name: "",
    imageUrl: "",
    price: 0,
    description: "",
  });

  /* ───────── load wishlist ───────── */
  const load = async () => {
    try {
      setLoading(true);
      const data = await getWishlist(id);
      setWishlist(data);
    } catch {
      setAlert({ type: "danger", msg: "Failed to load wishlist." });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ───────── role check ───────── */
  const userEmail = auth.currentUser?.email;
  const role      = wishlist?.roles?.[userEmail] || "viewer";
  const canEdit   = role === "owner" || role === "editor";

  /* ───────── item actions ───────── */
  const addManual = async () => {
    if (!canEdit) return;
    if (!manualItem.name.trim()) {
      setAlert({ type: "warning", msg: "Item name is required." });
      return;
    }
    try {
      setBusy(true);
      await addItem(id, { ...manualItem, addedBy: userEmail });
      setAlert({ type: "success", msg: "Item added!" });
      setManualItem({ name: "", imageUrl: "", price: 0, description: "" });
      load();
    } catch {
      setAlert({ type: "danger", msg: "Error adding item." });
    } finally {
      setBusy(false);
    }
  };

  const addDummy = async (p) => {
    if (!canEdit) return;
    try {
      setBusy(true);
      await addItem(id, {
        name: p.title,
        imageUrl: p.image,
        price: p.price,
        description: p.description,
        addedBy: userEmail,
      });
      setAlert({ type: "success", msg: "Item added from dummy list!" });
      load();
    } catch {
      setAlert({ type: "danger", msg: "Failed to add dummy item." });
    } finally {
      setBusy(false);
    }
  };

  const del = async (itemId) => {
    if (!canEdit) return;
    try {
      setBusy(true);
      await deleteItem(id, itemId);
      setAlert({ type: "success", msg: "Item deleted." });
      load();
    } catch {
      setAlert({ type: "danger", msg: "Failed to delete item." });
    } finally {
      setBusy(false);
    }
  };

  /* ───────── ui ───────── */
  return (
    <div>
      <Navbar />
      <div className="container py-4">

        {/* alerts */}
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.msg}
          </div>
        )}

        {/* top heading */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status" />
            <p className="mt-2">Loading wishlist...</p>
          </div>
        ) : (
          <>
            <h2>{wishlist?.name}</h2>
            <p className="text-muted">
              Your role: <b>{role}</b>
            </p>

            {/* Add Custom Item */}
            {canEdit && (
              <div className="card p-3 mb-4 shadow-sm">
                <h5>Add Custom Item</h5>
                <div className="row g-3">
                  {/* inputs */}
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Item name"
                      value={manualItem.name}
                      disabled={busy}
                      onChange={(e) =>
                        setManualItem({ ...manualItem, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Image URL"
                      value={manualItem.imageUrl}
                      disabled={busy}
                      onChange={(e) =>
                        setManualItem({ ...manualItem, imageUrl: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      value={manualItem.price}
                      disabled={busy}
                      onChange={(e) =>
                        setManualItem({
                          ...manualItem,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      value={manualItem.description}
                      disabled={busy}
                      onChange={(e) =>
                        setManualItem({
                          ...manualItem,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-12 text-end">
                    <button
                      className="btn btn-primary"
                      onClick={addManual}
                      disabled={busy}
                    >
                      {busy ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        "Add Item"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dummy Product List */}
            <div className="mb-5">
              <h5 className="mb-3">Select a Dummy Product</h5>
              <DummyProductList onSelect={addDummy} canEdit={canEdit && !busy} />
            </div>

            {/* Wishlist Items */}
            <h4 className="mb-3">Items in this Wishlist</h4>
            {wishlist?.items?.length === 0 ? (
              <p className="text-muted">No items yet. Start adding some!</p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {wishlist?.items?.map((it) => (
                  <div className="col" key={it.id}>
                    <div className="card h-100 shadow-sm">
                      <img
                        src={it.imageUrl}
                        className="card-img-top"
                        alt={it.name}
                        style={{ height: 200, objectFit: "contain" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{it.name}</h5>
                        <p className="card-text text-muted mb-2">
                          {it.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">₹{it.price}</span>
                          {canEdit && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              disabled={busy}
                              onClick={() => del(it.id)}
                            >
                              {busy ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          )}
                        </div>
                        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
                          Added by {it.addedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

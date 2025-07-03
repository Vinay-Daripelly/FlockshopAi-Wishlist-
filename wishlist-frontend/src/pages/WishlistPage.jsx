import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { getWishlist, addItem, deleteItem } from "../services/api";
import Navbar from "../components/Navbar";
import DummyProductList from "../components/DummyProductList";

export default function WishlistPage() {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [manualItem, setManualItem] = useState({
    name: "",
    imageUrl: "",
    price: 0,
    description: "",
  });

  /* ───────── load wishlist ───────── */
  const load = async () => {
    const data = await getWishlist(id);
    setWishlist(data);
  };
  useEffect(() => {
    load();
  }, [id]);

  /* ───────── role check ───────── */
  const userEmail = auth.currentUser?.email;
  const role = wishlist?.roles?.[userEmail] || "viewer";
  const canEdit = role === "owner" || role === "editor";

  /* ───────── item actions ───────── */
  const addManual = async () => {
    if (!manualItem.name.trim() || !canEdit) return;
    await addItem(id, { ...manualItem, addedBy: userEmail });
    setManualItem({ name: "", imageUrl: "", price: 0, description: "" });
    load();
  };

  const addDummy = async (p) => {
    if (!canEdit) return;
    await addItem(id, {
      name: p.title,
      imageUrl: p.image,
      price: p.price,
      description: p.description,
      addedBy: userEmail,
    });
    load();
  };

  const del = async (itemId) => {
    if (!canEdit) return;
    await deleteItem(id, itemId);
    load();
  };

  /* ───────── ui ───────── */
  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-1">{wishlist?.name}</h2>
        <p className="text-muted">
          Your role: <b>{role}</b>
        </p>

        {/* Add Custom Item (only for editors/owners) */}
        {canEdit && (
          <div className="card p-3 mb-4 shadow-sm">
            <h5>Add Custom Item</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Item name"
                  value={manualItem.name}
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
                  onChange={(e) =>
                    setManualItem({
                      ...manualItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-primary" onClick={addManual}>
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dummy Product List */}
        <div className="mb-5">
          <h5 className="mb-3">Select a Dummy Product</h5>
          <DummyProductList onSelect={addDummy} canEdit={canEdit} />
        </div>

        {/* Wishlist Items */}
        <h4 className="mb-3">Items in this Wishlist</h4>
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
                  <p className="card-text text-muted mb-2">{it.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">₹{it.price}</span>
                    {canEdit && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => del(it.id)}
                      >
                        Delete
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
      </div>
    </div>
  );
}

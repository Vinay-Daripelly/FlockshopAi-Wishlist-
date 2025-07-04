import { useEffect, useState } from "react";

export default function DummyProductList({ onSelect, canEdit = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((r) => r.json())
      .then(data => {
        setProducts(data);
        setError(null);
      })
      .catch(() => {
        setError("Could not load dummy products");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-4">
      <style>{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: scale(1.03);
          box-shadow: 0 0 10px rgba(0,0,0,0.15);
        }
        .card-description {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .hover-card:hover .card-description {
          max-height: 80px;
        }
      `}</style>

      {/* Feedback messages */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status" />
          <p className="mt-2">Loading dummy products...</p>
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="text-muted">No dummy products available.</p>
      )}

      {/* Product Cards */}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {products.map((p) => (
          <div className="col" key={p.id}>
            <div className="card h-100 hover-card">
              <img
                src={p.image}
                alt={p.title}
                className="card-img-top"
                style={{
                  height: "160px",
                  objectFit: "contain",
                  padding: "12px",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h6
                  className="card-title"
                  style={{ fontSize: "14px", minHeight: "38px" }}
                >
                  {p.title.length > 45 ? p.title.slice(0, 45) + "..." : p.title}
                </h6>

                <div
                  className="card-description text-muted"
                  style={{ fontSize: "12px" }}
                >
                  {p.description.length > 100
                    ? p.description.slice(0, 100) + "..."
                    : p.description}
                </div>

                {canEdit && (
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                    <span className="fw-bold text-primary">₹{p.price}</span>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onSelect(p)}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

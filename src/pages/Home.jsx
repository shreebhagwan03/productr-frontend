import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const [tab, setTab] = useState("published");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [lastAction, setLastAction] = useState("");



  const [form, setForm] = useState({
    name: "",
    type: "",
    stock: "",
    mrp: "",
    price: "",
    brand: "",
    exchange: "",
  });


  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async (type) => {
    const res = await api.get(`/products/status/${type}`);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts(tab);
  }, [tab]);

  /* ================= ACTIONS ================= */
  const togglePublish = async (id) => {
    await api.patch(`/products/${id}/publish`);
    loadProducts(tab);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/products/${deleteId}`);
      setDeleteId(null);
      loadProducts(tab);

      setLastAction("delete");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setDeleteLoading(false);
    }
  };


  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      type: product.type,
      stock: product.stock,
      mrp: product.mrp,
      price: product.price,
      brand: product.brand,
      exchange: product.exchange,
    });
    setImages([]);
    setErrors({});
    setShowModal(true);
  };
  const validate = () => {
    const err = {};
    if (!form.name) err.name = "Product name is required";
    if (!form.type) err.type = "Product type is required";
    if (!form.stock) err.stock = "Quantity stock is required";
    if (!form.mrp) err.mrp = "MRP is required";
    if (!form.price) err.price = "Selling price is required";
    if (!form.brand) err.brand = "Brand name is required";
    if (!form.exchange) err.exchange = "Exchange option is required";
    return err;
  };
  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append("images", img));

    await api.put(`/products/${editId}`, formData);

    setShowModal(false);
    loadProducts(tab);
    setLastAction("edit");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };



  return (
    <div className="p-3 p-sm-4">

      {/* ================= TABS ================= */}
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-2 gap-sm-3 border-bottom mb-4">
        <button
          className={`btn btn-link fw-semibold px-3 py-2 ${tab === "published"
              ? "text-primary "
              : "text-muted"
            }`}
          onClick={() => setTab("published")}
        >
          Published
        </button>

        <button
          className={`btn btn-link fw-semibold px-3 py-2 ${tab === "unpublished"
              ? "text-primary "
              : "text-muted"
            }`}
          onClick={() => setTab("unpublished")}
        >
          Unpublished
        </button>
      </div>
      {/* ================= DELETE CONFIRM MODAL ================= */}
      {deleteId && (
        <>
          {/* BACKDROP */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 3000 }}
            onClick={() => setDeleteId(null)}
          />

          {/* MODAL */}
          <div
            className="position-fixed top-50 start-50 translate-middle"
            style={{ zIndex: 3100, width: 320 }}
          >
            <div className="bg-white rounded-4 shadow-lg p-4 text-center">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 56,
                  height: 56,
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: 28,
                }}
              >
                🗑
              </div>

              <h6 className="fw-bold mb-2">
                Delete this product?
              </h6>

              <p className="small text-muted mb-4">
                This action cannot be undone.
              </p>

              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-outline-secondary px-3"
                  onClick={() => setDeleteId(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger px-3"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowModal(false)}
          />

          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-2"
            style={{ zIndex: 1050 }}
          >
            <div
              className="bg-white rounded shadow mx-auto"
              style={{ maxWidth: 420 }}
            >
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h6 className="mb-0 fw-semibold">
                  {editId ? "Edit Product" : "Add Product"}
                </h6>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div
                className="p-3"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {[
                  { name: "name", label: "Product Name" },
                  { name: "brand", label: "Brand Name" },
                  { name: "stock", label: "Quantity Stock", type: "number" },
                  { name: "mrp", label: "MRP", type: "number" },
                  { name: "price", label: "Selling Price", type: "number" },
                ].map((f) => (
                  <div key={f.name} className="mb-3">
                    <label className="form-label small">{f.label}</label>
                    <input
                      type={f.type || "text"}
                      className={`form-control ${errors[f.name] ? "is-invalid" : ""
                        }`}
                      value={form[f.name]}
                      onChange={(e) =>
                        setForm({ ...form, [f.name]: e.target.value })
                      }
                    />
                    <div className="invalid-feedback">
                      {errors[f.name]}
                    </div>
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label small">Product Type</label>
                  <select
                    className={`form-select ${errors.type ? "is-invalid" : ""
                      }`}
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option>Food</option>
                    <option>Furniture</option>
                    <option>Electronics</option>
                  </select>
                  <div className="invalid-feedback">{errors.type}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small">
                    Exchange / Return
                  </label>
                  <select
                    className={`form-select ${errors.exchange ? "is-invalid" : ""
                      }`}
                    value={form.exchange}
                    onChange={(e) =>
                      setForm({ ...form, exchange: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  <div className="invalid-feedback">
                    {errors.exchange}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small">Images</label>
                  <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={(e) =>
                      setImages(Array.from(e.target.files))
                    }
                  />
                </div>
              </div>

              <div className="p-3 border-top text-end">
                <button
                  className="btn btn-success px-4"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {success && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-3 px-2"
          style={{ zIndex: 5000 }}
        >

          <div
            className={`px-3 py-2 rounded shadow text-center small d-inline-block ${lastAction === "delete"
                ? "bg-danger text-white"
                : "bg-success text-white"
              }`}
            style={{ width: "fit-content" }}
          >
            {lastAction === "delete"
              ? "Product deleted successfully 🗑"
              : "Product updated successfully ✅"}
          </div>
        </div>
      )}


      {/* ================= EMPTY STATE ================= */}
      {products.length === 0 && (
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center px-3"
          style={{ minHeight: "60vh" }}
        >
          <div
            className="mb-3"
            style={{
              fontSize: "clamp(32px, 6vw, 42px)",
              color: "#1d4ed8",
              lineHeight: 1.2,
            }}
          >
            ⬜ ⬜ <br /> ⬜ ➕
          </div>

          <h5 className="fw-bold mt-2">
            No {tab === "published" ? "Published" : "Unpublished"} Products
          </h5>

          <p className="text-muted mb-0">
            Your {tab} products will appear here
          </p>
        </div>
      )}

      {/* ================= PRODUCTS GRID ================= */}
      {products.length > 0 && (
        <div className="row g-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="col-12 col-sm-6 col-lg-4"
            >
              <div className="card shadow-sm h-100 small">
                {/* IMAGE */}
                <img
                  src={p.images[0]}
                  className="card-img-top p-2"
                  style={{
                    height: 140,
                    objectFit: "contain",
                  }}
                  alt={p.name}
                />

                {/* DETAILS */}
                <div className="card-body py-2">
                  <h6 className="fw-semibold mb-1 text-truncate">
                    {p.name}
                  </h6>

                  <div className="text-muted">Type: {p.type}</div>
                  <div className="text-muted">Stock: {p.stock}</div>
                  <div className="text-muted">MRP: ₹ {p.mrp}</div>
                  <div className="text-muted">Price: ₹ {p.price}</div>
                  <div className="text-muted">Brand: {p.brand}</div>
                  <div className="text-muted">
                    Images: {p.images.length}
                  </div>
                  <div className="text-muted">
                    Exchange: {p.exchange}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="card-footer bg-white d-flex gap-2 p-2">
                  {/* PUBLISH / UNPUBLISH */}
                  <button
                    className={`btn btn-sm flex-fill ${p.isPublished ? "btn-success" : "btn-primary"
                      }`}
                    onClick={() => togglePublish(p._id)}
                  >
                    {p.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  {/* EDIT */}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setDeleteId(p._id)}

                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;

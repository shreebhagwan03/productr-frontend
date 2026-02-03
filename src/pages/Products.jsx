import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const location = useLocation();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", 
  });

  const [form, setForm] = useState({
    name: "",
    type: "",
    stock: "",
    mrp: "",
    price: "",
    brand: "",
    exchange: "",
  });

  useEffect(() => {
    if (location.state?.editProduct) {
      const p = location.state.editProduct;

      setEditId(p._id);
      setForm({
        name: p.name,
        type: p.type,
        stock: p.stock,
        mrp: p.mrp,
        price: p.price,
        brand: p.brand,
        exchange: p.exchange,
      });

      setShowModal(true);
    }
  }, [location.state]);

  /* LOAD PRODUCTS */
  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* FORM */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setImages(Array.from(e.target.files));
  };

  const validate = () => {
    const err = {};

    if (!form.name) err.name = "Product name is required";
    if (!form.type) err.type = "Product type is required";
    if (!form.stock) err.stock = "Quantity stock is required";
    if (!form.mrp) err.mrp = "MRP is required";
    if (!form.price) err.price = "Selling price is required";
    if (!form.brand) err.brand = "Brand name is required";
    if (!form.exchange) err.exchange = "Exchange / return option is required";

    if (!editId && images.length === 0)
      err.images = "Product image is required";

    return err;
  };


  /*  CREATE / UPDATE  */
  const handleSubmit = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append("images", img));

    try {
      if (editId) {
        await api.put(`/products/${editId}`, formData);
      } else {
        await api.post("/products", formData);
      }

      setShowModal(false);
      setEditId(null);
      setForm({
        name: "",
        type: "",
        stock: "",
        mrp: "",
        price: "",
        brand: "",
        exchange: "",
      });
      setImages([]);
      setErrors({});
      setToast({
        show: true,
        message: editId
          ? "Product updated successfully "
          : "Product created successfully ",
        type: "success",
      });

      setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 2000);

      fetchProducts();
    } catch {
      alert("Product save failed");
    }
  };

  /*EDIT  */
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
    setShowModal(true);
  };


  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/products/${deleteId}`);
      setDeleteId(null);
      fetchProducts();
      setToast({
        show: true,
        message: "Product deleted successfully 🗑",
        type: "danger",
      });

      setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 2000);

    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePublish = async (id) => {
    await api.patch(`/products/${id}/publish`);
    fetchProducts();
  };


  return (
    <div className="p-3 p-sm-4">
      {/* HEADER */}
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-link fw-semibold p-0"
          onClick={() => {
            setEditId(null);
            setShowModal(true);
          }}
        >
          + Add Products
        </button>
      </div>

      {/* PRODUCT GRID  */}
      <div className="row g-3">
        {products.map((p) => (
          <div
            key={p._id}
            className="col-12 col-sm-6 col-lg-4"
          >
            <div className="card shadow-sm h-100 small">
              <img
                src={p.images[0]}
                className="card-img-top p-2"
                style={{
                  height: 140,
                  objectFit: "contain",
                }}
                alt={p.name}
              />

              <div className="card-body py-2">
                <h6 className="fw-semibold mb-1 text-truncate">
                  {p.name}
                </h6>

                <div className="text-muted">Type: {p.type}</div>
                <div className="text-muted">Stock: {p.stock}</div>
                <div className="text-muted">MRP: ₹{p.mrp}</div>
                <div className="text-muted">Price: ₹{p.price}</div>
                <div className="text-muted">Brand: {p.brand}</div>
              </div>

              <div className="card-footer bg-white d-flex gap-2 p-2">
                <button
                  className={`btn btn-sm flex-fill ${p.isPublished ? "btn-success" : "btn-primary"
                    }`}
                  onClick={() => togglePublish(p._id)}
                >
                  {p.isPublished ? "Unpublish" : "Publish"}
                </button>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>

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

      {deleteId && (
        <>
          {/* BACKDROP */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 2000 }}
            onClick={() => setDeleteId(null)}
          />

          {/* MODAL */}
          <div
            className="position-fixed top-50 start-50 translate-middle"
            style={{ zIndex: 2100, width: 320 }}
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
      {/*  MODAL */}
      {showModal && (
        <>
          {/* OVERLAY */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setShowModal(false)}
          />

          {/* MODAL WRAPPER */}
          <div
            className="position-fixed top-50 start-50 translate-middle w-100 px-2 px-sm-3"
            style={{ zIndex: 1050 }}
          >
            {/* MODAL */}
            <div
              className="bg-white rounded shadow mx-auto"
              style={{
                width: "100%",
                maxWidth: 420, 
                maxHeight: "calc(100vh - 30px)",
              }}
            >
              {/* HEADER */}
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


              {/* BODY */}
              <div
                className="p-3"
                style={{
                  maxHeight: "65vh",
                  overflowY: "auto",
                }}
              >
                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label small">Product Name</label>
                  <input
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                {/* Product Type */}
                <div className="mb-3">
                  <label className="form-label small">Product Type</label>
                  <select
                    name="type"
                    className={`form-select ${errors.type ? "is-invalid" : ""}`}
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">Select product type</option>
                    <option value="Food">Food</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="invalid-feedback">{errors.type}</div>
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <label className="form-label small">Quantity Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    placeholder="Total stock available"
                    value={form.stock}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.stock}</div>
                </div>

                {/* MRP */}
                <div className="mb-3">
                  <label className="form-label small">MRP</label>
                  <input
                    type="number"
                    name="mrp"
                    className={`form-control ${errors.mrp ? "is-invalid" : ""}`}
                    placeholder="Enter MRP"
                    value={form.mrp}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.mrp}</div>
                </div>

                {/* Selling Price */}
                <div className="mb-3">
                  <label className="form-label small">Selling Price</label>
                  <input
                    type="number"
                    name="price"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    placeholder="Enter selling price"
                    value={form.price}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.price}</div>
                </div>

                {/* Brand */}
                <div className="mb-3">
                  <label className="form-label small">Brand Name</label>
                  <input
                    name="brand"
                    className={`form-control ${errors.brand ? "is-invalid" : ""}`}
                    placeholder="Enter brand name"
                    value={form.brand}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.brand}</div>
                </div>

                {/* Images */}
                <div className="mb-3">
                  <label className="form-label small">
                    Upload Product Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className={`form-control ${errors.images ? "is-invalid" : ""}`}
                    onChange={handleImageUpload}
                  />
                  <div className="invalid-feedback">{errors.images}</div>
                </div>

                {/* Exchange */}
                <div className="mb-2">
                  <label className="form-label small">
                    Exchange or return eligibility
                  </label>
                  <select
                    name="exchange"
                    className={`form-select ${errors.exchange ? "is-invalid" : ""
                      }`}
                    value={form.exchange}
                    onChange={handleChange}
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <div className="invalid-feedback">{errors.exchange}</div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-3 border-top">
                <div className="p-3 border-top text-center text-sm-end">
                  <button
                    className={`btn ${editId ? "btn-success" : "btn-primary"} 
      w-100 w-sm-auto px-4`}
                    onClick={handleSubmit}
                  >
                    {editId ? "Save Changes" : "Create Product"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {toast.show && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-5 px-2">
          <div
            className={`px-3 py-2 rounded shadow text-center small d-inline-block ${toast.type === "success"
                ? "bg-success text-white"
                : "bg-danger text-white"
              }`}
            style={{ width: "fit-content" }}
          >
            {toast.message}
          </div>
        </div>
      )}


    </div>
  );
};

export default Products;

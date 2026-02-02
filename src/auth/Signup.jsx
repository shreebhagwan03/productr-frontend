import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  //  Field specific errors
  const [valueError, setValueError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //  API / global error (delete nahi kiya)
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const signup = async () => {
    setError("");
    setValueError("");
    setPasswordError("");

    let isValid = true;


    // EMAIL / MOBILE VALIDATION
    if (!value) {
      setValueError("Email or phone number is required");
      isValid = false;
    }
    //  ONLY NUMBERS → PHONE
    else if (/^\d+$/.test(value)) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        setValueError("Phone number is invalid");
        isValid = false;
      }
    }
    //  HAS TEXT → EMAIL
    else {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setValueError("Email address is invalid");
        isValid = false;
      }
    }

    // PASSWORD
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 digits");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email: value.includes("@") ? value : undefined,
        mobile: !value.includes("@") ? value : undefined,
        password,
        type: "signup",
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        {/* LEFT IMAGE */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <div
            className="w-75 rounded-4 shadow position-relative d-flex align-items-center justify-content-center"
            style={{
              height: "85%",
              background: "linear-gradient(135deg, #e0e7ff, #fef3c7, #fde68a)",
            }}
          >
            {/* LOGO */}
            <div className="position-absolute top-0 start-0 p-3 fw-bold">
              Productr<span style={{ color: "orange" }}>🔥</span>
            </div>

            {/* IMAGE WRAPPER */}
            <div
              className="d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: "260px",
                height: "420px",
                borderRadius: "28px",
                background: "linear-gradient(180deg, #ffedd5, #fed7aa)",
              }}
            >
              <img
                src="/Product.png"
                alt="hero"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                  borderRadius: "22px",
                }}
              />
            </div>
          </div>
        </div>



        {/* RIGHT FORM */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center px-3">
          <div className="w-100" style={{ maxWidth: 360 }}>
            <h5 className="fw-bold text-primary text-center mb-4">
              Create your Productr Account
            </h5>

            {/* API ERROR ONLY */}
            {error && (
              <div className="text-danger small text-center mb-2">
                {error}
              </div>
            )}

            <label className="form-label small">
              Email or Phone number
            </label>

            <input
              className="form-control mb-1"
              placeholder="Enter email or phone number"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setValueError("");
              }}

            />

            {valueError && (
              <div className="text-danger small mb-2">
                {valueError}
              </div>
            )}

            <div className="position-relative mb-1">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Create Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }} />

              <span
                className="position-absolute top-50 end-0 translate-middle-y px-3"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {passwordError && (
              <div className="text-danger small mb-3">
                {passwordError}
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              onClick={signup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            <div
              className="border rounded text-center mt-4 p-3 small text-muted"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Already have a Productr Account?
              <br />
              <span className="fw-bold text-primary">
                Login Here
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
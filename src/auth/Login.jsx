import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");

  const [valueError, setValueError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    setValueError("");
    setPasswordError("");

    let isValid = true;

    if (!value) {
      setValueError("Email or phone number is required");
      isValid = false;
    }
    else if (/^\d+$/.test(value)) {
      if (!/^[6-9]\d{9}$/.test(value)) {
        setValueError("Phone number is invalid");
        isValid = false;
      }
    }
    else {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setValueError("Email address is invalid");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } 
    else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) {
      console.log("Login validation failed");
      return;
    }

    try {
      await api.post("/auth/send-otp", {
        email: /^\d+$/.test(value) ? undefined : value,
        mobile: /^\d+$/.test(value) ? value : undefined,
        password,
        type: "login",
      });
      console.log("OTP sent successfully");

      navigate("/otp", {
        state: { value },
        replace: true,
      });

    } catch (err) {

      if (err.response) {
        console.log("Login server error:", err.response.data);
        console.log("Status:", err.response.status);
        setError(err.response.data?.message || "Login failed");
      }
      else if (err.request) {
        console.log("Server not responding");
        setError("Unable to connect. Try again.");
      }
      else {
        console.log("Login error:", err.message);
        setError("Login failed");
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">


        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
          <div
            className="w-75 rounded-4 shadow position-relative d-flex align-items-center justify-content-center"
            style={{
              height: "85%",
              background: "linear-gradient(135deg, #e0e7ff, #fef3c7, #fde68a)",
            }}
          >
            <div className="position-absolute top-0 start-0 p-3 fw-bold">
              Productr<span style={{ color: "orange" }}>🔥</span>
            </div>

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

        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center px-3">

          <form
            className="w-100"
            style={{ maxWidth: 360 }}
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <h5 className="fw-bold text-primary text-center mb-4">
              Login to your Productr Account
            </h5>

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
              autoComplete="username"
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
                placeholder="Enter Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />

              <span
                className="position-absolute top-50 end-0 translate-middle-y px-3"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>

            {passwordError && (
              <div className="text-danger small mb-3">
                {passwordError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>

            <div
              className="border rounded text-center mt-4 p-3 small text-muted"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Don’t have a Productr Account?
              <br />
              <span className="fw-bold text-primary">
                SignUp Here
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

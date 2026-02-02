import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Otp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");

  // email OR mobile
  const value = state?.value;

  /* ================= PROTECT PAGE ================= */
  useEffect(() => {
    if (!value) navigate("/login", { replace: true });
  }, [value, navigate]);



  /* ================= OTP INPUT ================= */
  const handleChange = (val, i) => {
    if (!/^[0-9]?$/.test(val)) return;

    const copy = [...otp];
    copy[i] = val;
    setOtp(copy);
    setError("");

    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    setError("");
    if (otp.join("").length < 6) {
      setError("Please enter full 6 digit OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-otp", {
        email: /^\d+$/.test(value) ? undefined : value,
        mobile: /^\d+$/.test(value) ? value : undefined,
        otp: otp.join(""),
      });

      // LOGIN SUCCESS
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isLoggedIn", "true");

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };


  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center px-3 ">
          <div className="w-100" style={{ maxWidth: 360 }}>
            <h5 className="fw-bold text-primary text-center mb-4">
              Verify OTP
            </h5>

            {/* OTP INPUTS */}
            <div className="d-flex justify-content-between gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  maxLength="1"
                  inputMode="numeric"
                  className="form-control text-center fs-5"
                  style={{ width: 48, height: 48 }}
                  value={d}
                  onChange={(e) =>
                    handleChange(e.target.value, i)
                  }
                />
              ))}
            </div>

            {/* ERROR BELOW OTP */}
            {error && (
              <div className="text-danger small text-center mt-2 mb-3">
                {error}
              </div>
            )}



            {/* VERIFY BUTTON */}
            <button
              className="btn btn-primary w-100 mt-4"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;

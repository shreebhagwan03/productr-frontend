import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // PAGE TITLE LOGIC
  const pageTitle =
    location.pathname === "/home"
      ? "Home"
      : location.pathname === "/products"
        ? "Products"
        : "";

  // LOGOUT
  const logout = () => {

    console.log("User logged out");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");

    navigate("/login", { replace: true });
  };

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // AUTH GUARD
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar show={showSidebar} setShow={setShowSidebar} />

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column ms-md-240">

        {/* MOBILE TOP BAR */}
        <div
          className="d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom position-fixed top-0 start-0 w-100 d-md-none"
          style={{ zIndex: 1100 }}
        >
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowSidebar(prev => !prev)}
          >
            ☰
          </button>

          <h6 className="mb-0 fw-semibold">{pageTitle}</h6>

          {/* MOBILE PROFILE */}
          <div className="position-relative" ref={profileRef}>
            <div
              className="rounded-circle bg-secondary text-white px-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfile(p => !p)}
            >
              User
            </div>

            {showProfile && (
              <div
                className="position-absolute end-0 mt-2 bg-white shadow rounded"
                style={{ width: 120, zIndex: 1200 }}
              >
                <div
                  className="px-3 py-2 small"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP TOP BAR */}
        <div className="d-none d-md-flex align-items-center justify-content-between px-4 py-2 bg-white border-bottom">
          <h5 className="mb-0 fw-semibold">{pageTitle}</h5>

          {/* DESKTOP PROFILE */}
          <div className="position-relative" ref={profileRef}>
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                cursor: "pointer",
                userSelect: "none",
                fontSize: 12,
                fontWeight: 600,
              }}
              onClick={() => setShowProfile(p => !p)}
            >
              User
            </div>

            {showProfile && (
              <div
                className="position-absolute end-0 mt-2 bg-white shadow rounded"
                style={{ width: 120, zIndex: 1200 }}
              >
                <div
                  className="px-3 py-2 small"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

   
        <div className="flex-grow-1 p-3 p-sm-4 pt-5 pt-md-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

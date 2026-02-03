import { NavLink } from "react-router-dom";

const Sidebar = ({ show, setShow }) => {

  const handleNavigation = (route) => {
    console.log("Navigating to:", route);
    setShow(false);
  };

  const handleOverlayClick = () => {
    console.log("Sidebar closed");
    setShow(false);
  };

  return (
    <>
      {/* OVERLAY (MOBILE) */}
      {show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={handleOverlayClick}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`text-white p-3 position-fixed top-0 start-0 h-100 ${
          show ? "d-block" : "d-none"
        } d-md-block`}
        style={{
          width: 240,
          background: "#0f172a",
          zIndex: 1050,
        }}
      >
        <h5 className="fw-bold mb-4">
          Productr <span style={{ color: "orange" }}>🔥</span>
        </h5>

        <input
          className="form-control form-control-sm mb-4"
          placeholder="Search"
        />

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `nav-link ${isActive ? "text-white fw-bold" : "text-white-50"}`
          }
          onClick={() => handleNavigation("/home")}
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `nav-link ${isActive ? "text-white fw-bold" : "text-white-50"}`
          }
          onClick={() => handleNavigation("/products")}
        >
          Products
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;

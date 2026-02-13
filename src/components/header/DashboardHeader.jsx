import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { DASHBOARD_ROUTES } from "../../routes/DashboardRouteConfig.jsx";
import { RemoveToken } from "../../utils/AuthHelper.jsx";
import { useTheme } from "../../hooks/useTheme.jsx";
import { GetCookie, RemoveCookie } from "../../utils/CookieManager.jsx";

const DashboardHeader = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [initials, setInitials] = useState("");
  const [userName, setUserName] = useState("");
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = originalOverflow || "auto";
    };
  }, [open]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      // Close mobile menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const firstName = GetCookie("tp_user_first_name");
    const lastName = GetCookie("tp_user_last_name");

    const firstInitial = firstName?.charAt(0).toUpperCase() || "";
    const lastInitial = lastName?.charAt(0).toUpperCase() || "";

    const combinedInitials = `${firstInitial}${lastInitial}`;

    if (combinedInitials) {
      setInitials(combinedInitials);
    }
  }, []);

  const handleLogout = () => {
    RemoveToken();
    RemoveCookie("tp_user_first_name");
    RemoveCookie("tp_user_last_name");
    navigate("/", { replace: true });
  };

  return (
    <header className="tp-header tp-header--dashboard" ref={menuRef}>
      <div className="tp-header-inner">
        {/* LOGO */}
        <div className="tp-logo" onClick={() => navigate("/overview")}>
          <img src="/logo.svg" alt="TradePulse" className="tp-logo-img" />
          <span className="tp-logo-text">TradePulse</span>
        </div>

        {/* NAV */}
        <nav className={`tp-dashboard-nav ${open ? "open" : ""}`}>
          {DASHBOARD_ROUTES.filter((r) => !r.hidden).map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              className={({ isActive }) =>
                `tp-dashboard-link ${isActive ? "active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {r.label}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="tp-dashboard-actions">
          <FiBell className="tp-notification" />
          <FiSettings onClick={() => navigate("/settings")} />

          <button className="tp-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <div className="tp-profile" ref={profileRef}>
            <div
              className="tp-avatar"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {initials || "U"}
            </div>

            {profileOpen && (
              <div className="tp-profile-dropdown">
                <button onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="tp-menu-btn" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

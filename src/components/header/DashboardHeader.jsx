import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";

import { useTheme } from "../../hooks/useTheme.jsx";
import { GetCookie, RemoveCookie } from "../../utils/CookieManager.jsx";
import { RemoveToken } from "../../utils/AuthHelper.jsx";
import { useDispatch } from "react-redux";
import { clearAuthData } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";

const DashboardHeader = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);
  const [initials, setInitials] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  const profileRef = useRef(null);

  /* =========================
     GET USER INITIALS
  ========================== */
  useEffect(() => {
    const first = GetCookie("tp_user_first_name");
    const last = GetCookie("tp_user_last_name");

    const f = first?.charAt(0).toUpperCase() || "";
    const l = last?.charAt(0).toUpperCase() || "";

    setInitials(`${f}${l}`);
  }, []);

  /* =========================
     CLICK OUTSIDE CLOSE
  ========================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  /* =========================
     RESPONSIVE CHECK
  ========================== */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = () => {
    RemoveToken();
    RemoveCookie("tp_user_first_name");
    RemoveCookie("tp_user_last_name");
    dispatch(clearAuthData());
    navigate("/", { replace: true });
  };

  return (
    <div className="tp-dashboard-header">

      {/* LEFT */}
      <div className="tp-dashboard-header-left">
        <button
          className="tp-header-menu-btn"
          onClick={onMenuClick}
        >
          ☰
        </button>
         {/* ✅ ADMIN BADGE */}
  {role === "ADMIN" && !isMobile && (
    <span className="tp-admin-badge">
      Admin Panel
    </span>
  )}
      </div>

      {/* CENTER TITLE */}
      <div className="tp-dashboard-header-center">
        <h2 className="tp-dashboard-platform-title">
          Corridor Intelligence Dashboard
        </h2>
      </div>

      {/* RIGHT */}
      <div className="tp-dashboard-header-right">
        <button className="tp-dashboard-icon-btn">
          <FiBell />
        </button>

        {!isMobile && (
          <button
            className="tp-dashboard-icon-btn"
            onClick={() => navigate("/settings")}
          >
            <FiSettings />
          </button>
        )}

        <button
          className="tp-dashboard-icon-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <div className="tp-profile" ref={profileRef}>
          <div
            className="tp-avatar"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            {initials || "U"}
          </div>

          {profileOpen && (
            <div className="tp-profile-dropdown">

              {isMobile && (
                <button
                  onClick={() => {
                    navigate("/settings");
                    setProfileOpen(false);
                  }}
                >
                  <FiSettings />
                  Settings
                </button>
              )}

              <button onClick={handleLogout}>
                <FiLogOut />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardHeader;
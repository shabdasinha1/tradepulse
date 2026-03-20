import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate,useLocation } from "react-router-dom";
import {
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
  FiCalendar 
} from "react-icons/fi";

import { HiOutlineViewGrid } from "react-icons/hi";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";
import { RiLineChartLine } from "react-icons/ri";
import { AiOutlineRobot } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { isAdminUser } from "../../utils/AdminHelper.jsx";

const ICON_MAP = {
  "/overview": <HiOutlineViewGrid />,
  "/product": <MdOutlineInventory2 />,
  "/suppliers": <FaUsers />,
  "/forecast": <RiLineChartLine />,
  "/reports": <TbReportAnalytics />,
  "/watchlist": <BsBookmark />,
  "/ai-assistant": <AiOutlineRobot />,
  "/feedback-data": <FiMessageSquare />,
  "/scheduler": <FiCalendar />,
  "/settings": <FiSettings />,
};

import { DASHBOARD_ROUTES } from "../../routes/DashboardRouteConfig.jsx";
import { RemoveToken } from "../../utils/AuthHelper.jsx";
import { useTheme } from "../../hooks/useTheme.jsx";
import { GetCookie, RemoveCookie } from "../../utils/CookieManager.jsx";


const DashboardSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  /* =========================
     STATES
  ========================== */
const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Persistent collapse state
  const [collapsed, setCollapsed] = useState(() => {
    if (window.innerWidth <= 768) return false;
    return localStorage.getItem("tp_sidebar_collapsed") === "true";
  });
  const [initials, setInitials] = useState("");

  const sidebarRef = useRef(null);
  const profileRef = useRef(null);

  /* =========================
     PERSIST COLLAPSE STATE
  ========================== */
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("tp_sidebar_collapsed", collapsed);
    }
  }, [collapsed, isMobile]);

  /* =========================
     BODY SCROLL LOCK (MOBILE)
  ========================== */
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = original || "auto";
    };
  }, [open]);

  /* =========================
     CLICK OUTSIDE
  ========================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  /* =========================
     USER INITIALS
  ========================== */
  useEffect(() => {
    const first = GetCookie("tp_user_first_name");
    const last = GetCookie("tp_user_last_name");

    const f = first?.charAt(0).toUpperCase() || "";
    const l = last?.charAt(0).toUpperCase() || "";

    setInitials(`${f}${l}`);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="tp-sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`tp-sidebar 
          ${open ? "open" : ""} 
          ${collapsed ? "collapsed" : ""}`}
      >
        <div className="tp-sidebar-inner">

          {/* ================= TOP ================= */}
          <div className="tp-sidebar-top">

            <div
              className="tp-logo"
              onClick={() => {
                navigate("/overview");
                setOpen(false);
              }}
            >
              <img
                src="/logo.svg"
                alt="TradePulse"
                className="tp-logo-img"
              />
              {!collapsed && (
                <span className="tp-logo-text">
                  TradePulse
                </span>
              )}
            </div>

            {/* Collapse Button (Desktop Only) */}
            {isMobile ? (
              <button
                className="tp-collapse-btn"
                onClick={() => setOpen(false)}
              >
                <FiX />
              </button>
            ) : (
              <button
                className="tp-collapse-btn"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
              </button>
            )}


          </div>

          {/* ================= NAV ================= */}
          <nav className="tp-sidebar-nav">

{DASHBOARD_ROUTES
  .filter((r) => {
    if (r.hidden) return false;

    // 🔥 Generic admin check
    if (r.adminOnly && !isAdminUser()) {
      return false;
    }

    return true;
  })
  .map((r) => (
              <NavLink
  key={r.path}
  to={r.path}
  className={({ isActive }) =>
    `tp-sidebar-link ${isActive ? "active" : ""}`
  }
  onClick={() => {
    if (isMobile) {
      setTimeout(() => {
        setOpen(false);
      }, 0);
    }
  }}
>
                {/* ICON */}
                <span className="tp-sidebar-icon">
                  {ICON_MAP[r.path]}
                </span>

                {/* LABEL */}
                {!collapsed && (
                  <span className="tp-sidebar-label">
                    {r.label}
                  </span>
                )}

                {/* TOOLTIP */}
                {collapsed && (
                  <span className="tp-sidebar-tooltip">
                    {r.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>


        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
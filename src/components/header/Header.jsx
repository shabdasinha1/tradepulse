import { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme.jsx";
import { PUBLIC_ROUTES } from "../../routes/PublicRouteConfig.jsx";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const headerRef = useRef(null); 

  const headerLinks = PUBLIC_ROUTES.filter((route) => route.showInHeader);

  const productLinks = PUBLIC_ROUTES.filter((route) => route.showInProducts);

  const closeMobileMenu = () => {
    setOpen(false);
    setProductsOpen(false);
  };
  const handleLogoClick = () => {
    closeMobileMenu();
    const isHome = location.pathname === "/";

    if (isHome) {
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Navigate to home
      navigate("/");
    }
  };

  const scrollToSection = (id) => {
    const isHome = window.location.pathname === "/";

    if (isHome) {
      const el = document.getElementById(id);
      if (!el) return;

      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setOpen(false);
      setProductsOpen(false);
    } else {
      // Navigate to home with hash
      navigate(`/#${id}`);
      setOpen(false);
      setProductsOpen(false);
    }
  };

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100); // wait for DOM render
  }, [location]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sections = ["features"];

    const onScroll = () => {
      const scrollPos = window.scrollY + 120; // header offset

      for (let id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const top = el.offsetTop;
        const height = el.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(id);
          return;
        }
      }

      setActiveSection(null);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      open &&
      headerRef.current &&
      !headerRef.current.contains(event.target)
    ) {
      setOpen(false);
      setProductsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);


  return (
    <header ref={headerRef} className="tp-header tp-header--public">
      <div className="tp-header-inner tp-container">
        {/* LOGO */}
        <div className="tp-header-logo" onClick={handleLogoClick}>
          <img src="/logo.svg" alt="TradePulse" className="tp-logo-img" />
          <span className="tp-logo-text">TradePulse</span>
        </div>

        {/* NAV */}
        <nav className={`tp-header-nav ${open ? "open" : ""}`}>
          {/* PRODUCTS DROPDOWN */}
          <div
            className={`tp-nav-dropdown ${productsOpen ? "open" : ""}`}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className="tp-nav-link tp-nav-dropdown-trigger"
              type="button"
              aria-haspopup="true"
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen((prev) => !prev)}
            >
              Products <FiChevronDown />
            </button>

            <div className="tp-nav-dropdown-menu">
              {productLinks.map((item) => (
                <button
                  key={item.label}
                  className="tp-dropdown-item is-coming"
                  onClick={() => {
                    setProductsOpen(false);
                    setOpen(false);
                    navigate(item.path);
                  }}
                >
                  <span>{item.label}</span>
                  {item.comingSoon && <span className="tp-nav-soon">Soon</span>}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN LINKS */}
          <button
            className={`tp-nav-link ${activeSection === "features" ? "active" : ""}`}
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          {headerLinks.map((route) => (
            <button
              key={route.path}
              className={`tp-nav-link ${
                location.pathname === route.path ? "active" : ""
              } ${route.comingSoon ? "is-coming" : ""}`}
              onClick={() => {
                closeMobileMenu();
                navigate(route.path);
              }}
            >
              {route.label}
              {route.comingSoon && <span className="tp-nav-soon">Soon</span>}
            </button>
          ))}

          {/* Mobile-only Sign In */}
          <button
            className="tp-nav-link tp-nav-signin-mobile"
            onClick={() => {
              setOpen(false);
              navigate("/login");
            }}
          >
            Sign in
          </button>
        </nav>

        {/* ACTIONS */}
        <div className="tp-header-actions">
          <button className="tp-btn-outline" onClick={() => navigate("/login")}>
            Sign in
          </button>

          <button className="tp-theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          <button className="tp-header-toggle" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PUBLIC_ROUTES } from "../../routes/PublicRouteConfig.jsx";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------
     ROUTE GROUPS (FROM CONFIG)
  -------------------------------- */
  const productLinks = PUBLIC_ROUTES.filter(
    (route) => route.showInProducts
  );

  const exploreLinks = PUBLIC_ROUTES.filter(
    (route) => route.showInHeader
  );

  /* -------------------------------
     SCROLL HANDLER (SAME AS HEADER)
  -------------------------------- */
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
    } else {
      navigate(`/#${id}`);
    }
  };

  /* Auto-scroll after route change */
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.pageYOffset - headerOffset;

    setTimeout(() => {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 100);
  }, [location]);

  return (
    <footer className="tp-footer">
      <div className="tp-container">

        {/* ================= TOP ================= */}
        <div className="tp-footer-top">

          {/* BRAND */}
          <div className="tp-footer-brand">
            <div
              className="tp-logo tp-footer-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img src="/logo.svg" alt="TradePulse" className="tp-logo-img" />
              <span className="tp-logo-text">TradePulse</span>
            </div>

            <p className="tp-footer-desc">
              AI powered cross border trade intelligence helping businesses
              make smarter, data-backed cross border decisions.
            </p>
          </div>

          {/* ================= LINKS ================= */}
          <div className="tp-footer-links">

            {/* PRODUCTS */}
            <div className="tp-footer-col">
              <span className="tp-footer-title">Products</span>

              {productLinks.map((item) => (
                <button
                  key={item.label}
                  className="tp-footer-link"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                  {item.comingSoon && (
                    <span className="tp-nav-soon">Soon</span>
                  )}
                </button>
              ))}
            </div>

            {/* EXPLORE */}
            <div className="tp-footer-col">
              <span className="tp-footer-title">Explore</span>

              <button onClick={() => scrollToSection("features")}>
                Features
              </button>

              {exploreLinks.map((route) => (
                <button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                >
                  {route.label}
                </button>
              ))}
            </div>

            {/* ACCOUNT */}
            <div className="tp-footer-col">
              <span className="tp-footer-title">Account</span>

              <button onClick={() => navigate("/login")}>
                Sign in
              </button>

              <button onClick={() => navigate("/register")}>
                Early Access
              </button>
            </div>

          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="tp-footer-divider" />

        {/* ================= BOTTOM ================= */}
        <div className="tp-footer-bottom">
  <span className="tp-footer-copy">
    © {new Date().getFullYear()} TradePulse. All rights reserved.
  </span>

  <a
  href="https://robotronix.co.in/"
  target="_blank"
  rel="noopener noreferrer"
  className="tp-footer-dev"
>
  Developed by Robotronix Engineering Tech Pvt. Ltd.
</a>

  <div className="tp-footer-socials">
    <a href="#" aria-label="LinkedIn">LinkedIn</a>
    <a href="#" aria-label="Twitter">Twitter</a>
  </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;

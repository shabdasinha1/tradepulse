import { lazy } from "react";

/* ===============================
   LAZY IMPORTS (PUBLIC)
================================ */

const About = lazy(() => import("../pages/public/about/About.jsx"));
const Contact = lazy(() => import("../pages/public/contact/Contact.jsx"));
const Pricing = lazy(() => import("../pages/public/pricing/Pricing.jsx"));
const ComingSoon = lazy(() =>
  import("../pages/coming-soon/ComingSoon.jsx")
);

export const PUBLIC_ROUTES = [
  /* ---------- PRODUCTS ---------- */
  {
    label: "Market Intelligence",
    path: "/coming-soon",
    component: ComingSoon,
    showInHeader: false,
    showInProducts: true,
    comingSoon: true,
  },
  {
    label: "Supplier Intelligence",
    path: "/coming-soon",
    component: ComingSoon,
    showInHeader: false,
    showInProducts: true,
    comingSoon: true,
  },
  {
    label: "Risk & Alerts",
    path: "/coming-soon",
    component: ComingSoon,
    showInHeader: false,
    showInProducts: true,
    comingSoon: true,
  },

  /* ---------- HEADER LINKS ---------- */
   {
    label: "Pricing",
    path: "/pricing",
    component: Pricing,
    showInHeader: true,
  },
  {
    label: "About",
    path: "/about",
    component: About,
    showInHeader: true,
  },
  {
    label: "Contact",
    path: "/contact",
    component: Contact,
    showInHeader: true,
  },
];

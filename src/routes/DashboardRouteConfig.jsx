import { lazy } from "react";

/* ===============================
   LAZY IMPORTS (DASHBOARD)
================================ */

const Overview = lazy(() => import("../pages/overview/Overview.jsx"));
const Commodities = lazy(() => import("../pages/commodities/Commodities.jsx"));
const Watchlist = lazy(() => import("../pages/watchlist/Watchlist.jsx"));
const DashboardProduct = lazy(() => import("../pages/dashboard-product/DashboardProduct.jsx"));
const Forecast = lazy(() => import("../pages/forecast/Forecast.jsx"));
const Report = lazy(() => import("../pages/report/Report.jsx"));
const Suppliers = lazy(() => import("../pages/suppliers/Suppliers.jsx"));
const TradeAssistant = lazy(()=> import("../pages/assistant/TradeAssistant.jsx"));
const Settings = lazy(() => import("../pages/settings/Settings.jsx"));
const Feedback = lazy(() => import("../pages/feedback/Feedback.jsx"));
const Scheduler = lazy(() => import("../pages/scheduler/Scheduler.jsx"));

export const DASHBOARD_ROUTES = [
  {
    label: " Corridor Intelligence Dashboard",
    path: "/overview",
    component: Overview,
  },
  {
    label: "Corridor Product Intelligence",
    path: "/product",
    component: DashboardProduct,
  },
  {
    label: "Exporter Reliability Intelligence",
    path: "/suppliers",
    component: Suppliers,
  },
  // {
  //   label: "Corridor FX & Cost Impact Monitort",
  //   path: "/forecast",
  //   component: Forecast,
  // },
  // {
  //   label: "Reports",
  //   path: "/reports",
  //   component: Report,
  // },
  // {
  //   label: "Watchlist",
  //   path: "/watchlist",
  //   component: Watchlist,
  // },
  // {
  //   label: "AI Trade Assistant",
  //   path: "/ai-assistant",
  //   component: TradeAssistant,
  // },
  {
    label: "Feedback",
    path: "/feedback-data", 
    component: Feedback,
    adminOnly: true,
  },
  {
    label: "Source Scheduler",
    path: "/scheduler",
    component: Scheduler,
    adminOnly: true,
  },
  {
    label: "Settings",
    path: "/settings",
    component: Settings,
    hidden: true,
  },
];

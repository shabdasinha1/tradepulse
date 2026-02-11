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

export const DASHBOARD_ROUTES = [
  {
    label: "Overview",
    path: "/overview",
    component: Overview,
  },
  {
    label: "Product",
    path: "/product",
    component: DashboardProduct,
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    component: Suppliers,
  },
  {
    label: "Forecast",
    path: "/forecast",
    component: Forecast,
  },
  {
    label: "Reports",
    path: "/reports",
    component: Report,
  },
  {
    label: "Watchlist",
    path: "/watchlist",
    component: Watchlist,
  },
  {
    label: "AI Assistant",
    path: "/ai-assistant",
    component: TradeAssistant,
  },
  {
    label: "Settings",
    path: "/settings",
    component: Settings,
    hidden: true,
  },
];

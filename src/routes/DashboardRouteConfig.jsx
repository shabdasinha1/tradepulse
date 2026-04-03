import { lazy } from "react";

/* ===============================
   LAZY IMPORTS (DASHBOARD)
================================ */

const Overview = lazy(() => import("../pages/overview/Overview.jsx"));
const Commodities = lazy(() => import("../pages/commodities/Commodities.jsx"));
const Watchlist = lazy(() => import("../pages/watchlist/Watchlist.jsx"));
const DashboardProduct = lazy(
  () => import("../pages/dashboard-product/DashboardProduct.jsx"),
);
const Forecast = lazy(() => import("../pages/forecast/Forecast.jsx"));
const Report = lazy(() => import("../pages/report/Report.jsx"));
const Suppliers = lazy(() => import("../pages/suppliers/Suppliers.jsx"));
const SuppliersManage = lazy(
  () => import("../pages/suppliers/SuppliersManagement.jsx"),
);
const TradeAssistant = lazy(
  () => import("../pages/assistant/TradeAssistant.jsx"),
);
const Settings = lazy(() => import("../pages/settings/Settings.jsx"));
const Feedback = lazy(() => import("../pages/feedback/Feedback.jsx"));
const Scheduler = lazy(() => import("../pages/scheduler/Scheduler.jsx"));
const FXRates = lazy(() => import("../pages/fx-rate/FxRate.jsx"));
const ShippingHistory = lazy(
  () => import("../pages/shipping history/ShippingHistory.jsx"),
);
const DutySnapshot = lazy(
  () => import("../pages/duty snapshot/DutySnapshot.jsx"),
);
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
  {
    label: "Corridor FX-Rates",
    path: "/fx-rates",
    component: FXRates,
  },
  {
    label: "Corridor Shipping Cost",
    path: "/shipping-history",
    component: ShippingHistory,
  },
  {
    label: "Corridor Duty Snapshot",
    path: "/duty-snapshot",
    component: DutySnapshot,
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
    label: "Suppliers Management",
    path: "/suppliers-manage",
    component: SuppliersManage,
    adminOnly: true,
  },
  {
    label: "Settings",
    path: "/settings",
    component: Settings,
    hidden: true,
  },
];

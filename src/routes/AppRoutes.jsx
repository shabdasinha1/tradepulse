import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { DASHBOARD_ROUTES } from "./DashboardRouteConfig.jsx";
import { PUBLIC_ROUTES } from "./PublicRouteConfig.jsx";
import { AUTH_ROUTES } from "./AuthRouteConfig.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Home from "../pages/home/Home.jsx";
import NotFound from "../pages/not-found/NotFound.jsx";

import PublicLayout from "../layouts/PublicLayout.jsx";
import PrivateLayout from "../layouts/PrivateLayout.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "../components/common/toast/ToastProvider.jsx";
import { isAdminUser } from "../utils/AdminHelper.jsx";

/* Simple loader */
const PageLoader = () => (
  <div className="tp-section">
    <p>Loading...</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <ToastProvider>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
          {/* 🌍 PUBLIC + AUTH — BLOCKED AFTER LOGIN */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <PublicLayout>
                  <Home />
                </PublicLayout>
              </PublicOnlyRoute>
            }
          />

          {AUTH_ROUTES.map(({ path, component: Component }) => ( 
            <Route
              key={path}
              path={path}
              element={
                <PublicOnlyRoute>
                  <PublicLayout>
                    <Component />
                  </PublicLayout>
                </PublicOnlyRoute>
              }
            />
          ))}

          {PUBLIC_ROUTES.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <PublicOnlyRoute>
                  <PublicLayout>
                    <Component />
                  </PublicLayout>
                </PublicOnlyRoute>
              }
            />
          ))}

          {/* 🔒 DASHBOARD ROUTES */}
        {DASHBOARD_ROUTES.map(({ path, component: Component, adminOnly }) => {
  // 🔥 Block admin routes
  if (adminOnly && !isAdminUser()) {
    return null;
  }

  return (
    <Route
      key={path}
      path={path}
      element={
        <ProtectedRoute>
          <PrivateLayout>
            <Component />
          </PrivateLayout>
        </ProtectedRoute>
      }
    />
  );
})}

          {/* 🚫 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            }
          />
        </Routes>
      </ToastProvider>
    </Suspense>
  );
};

export default AppRoutes;

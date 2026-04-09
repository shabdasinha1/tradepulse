import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IsAuthenticated, SetToken } from "../../utils/AuthHelper.jsx";
import { LoginUser } from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { SetCookie } from "../../utils/CookieManager.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardExchangeRate } from "../../services/DashboardService";
import { store } from "../../store"; 
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/slices/authSlice";

const USER_FIRST_NAME_KEY = "tp_user_first_name";
const USER_LAST_NAME_KEY = "tp_user_last_name";
const USER_EMAIL_KEY = "tp_user_email";

const Login = () => {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ===============================
     AUTO REDIRECT IF LOGGED IN
  ================================ */
  useEffect(() => {
    if (IsAuthenticated()) {
      navigate("/overview", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
     LOGIN HANDLER
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await LoginUser(form);

      if (res?.status === 200 || res?.success === true) {
        const token = res.access_token || res.data?.access_token;
       const user = res.data?.user;

        if (!token) {
          throw new Error("Token missing in response");
        }

        SetToken(token);
        const decoded = jwtDecode(token);
        // Save in Redux
dispatch(
  setAuthData({
    token: token,
    role: decoded.role,
    user: user,
  })
);
        const firstName = res.data?.user?.first_name;
        const lastName = res.data?.user?.last_name;
        const email = res.data?.user?.email;
     

        if (firstName) {
          SetCookie(USER_FIRST_NAME_KEY, firstName);
        }

        if (lastName) {
          SetCookie(USER_LAST_NAME_KEY, lastName);
        }
        if (email) {
          SetCookie(USER_EMAIL_KEY, email);
        }
        
       
const state = store.getState();
const reporterCode = state.corridor.reporterCode;
const partnerCode = state.corridor.partnerCode;

// ✅ PREFETCH FX
if (reporterCode && partnerCode) {
  await queryClient.prefetchQuery({
    queryKey: ["fx-global", reporterCode, partnerCode],
    queryFn: () =>
      DashboardExchangeRate({
        reporterCode,
        partnerCode,
      }),
  });
}

        navigate("/overview", { replace: true });
        return;
      }

      setErrorMsg(res?.message || "Login failed");
    } catch (error) {
      setErrorMsg(GetApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tp-section tp-section--auth tp-auth">
      <div className="tp-container">
        <div className="tp-grid tp-grid-2 tp-auth-grid">
          {/* ================= LEFT ================= */}
          <div className="tp-auth-info">
            <h1 className="tp-auth-title">
              Login to <span>TradePulse</span>
            </h1>

            <p className="tp-auth-sub">
              Access AI-powered trade intelligence, commodities, suppliers, and
              analytics — all in one secure platform.
            </p>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="tp-card tp-auth-card">
            <div className="tp-card-header">
              <h3 className="tp-card-title">Account Login</h3>
            </div>

            <form onSubmit={handleSubmit} className="tp-form tp-auth-form">
              <div className="tp-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="you@example.com"
                />
              </div>

              <div className="tp-form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="••••••••"
                />
              </div>

              {/* ERROR */}
              {errorMsg && (
                <div className="tp-auth-error tp-text-down">{errorMsg}</div>
              )}

              {/* LINKS */}
              <div className="tp-auth-actions">
                <span
                  className="tp-auth-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="tp-btn-primary tp-auth-btn"
                disabled={loading} // DISABLE the button when loading is true
              >
                {loading ? "Logging in..." : "Login"}{" "}
                {/* Button text changes based on loading */}
              </button>

              {/* FOOTER */}
              <p className="tp-auth-footer">
                Don’t have an account?{" "}
                <span
                  className="tp-auth-link"
                  onClick={() => navigate("/register")}
                >
                  Create one
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

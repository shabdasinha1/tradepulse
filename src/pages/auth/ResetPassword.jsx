import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserResetPassword,
  UserResendPasswordOtp,
} from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { GetCookie, RemoveCookie } from "../../utils/CookieManager.jsx";
import { toast } from "react-toastify";

const FORGOT_EMAIL_KEY = "tp_forgot_email";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  /* ===============================
     GET EMAIL FROM COOKIE
  ================================ */
  useEffect(() => {
    const storedEmail = GetCookie(FORGOT_EMAIL_KEY);

    if (!storedEmail) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    // Push a dummy history entry
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Force stay on the same page
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
   RESEND OTP
================================ */
  const handleResendOtp = async () => {
    setErrorMsg("");
    setButtonDisabled(true);
    try {
      const res = await UserResendPasswordOtp({
        email,
      });
      console.log(res);
      if (res?.success === true || res.data?.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      setErrorMsg(GetApiErrorMessage(error));
    } finally {
      setTimeout(() => {
        setButtonDisabled(false);
      }, 3000);
    }
  };
  /* ===============================
     SUBMIT HANDLER
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!otp) {
      setErrorMsg("OTP is required");
      return;
    }

    setLoading(true);

    try {
      const res = await UserResetPassword({
        email,
        otp,
        newPassword: form.password,
      });

      // ✅ SUCCESS CHECK
      if (res.data?.status === 200 && res?.success === true) {
        // ✅ CLEANUP COOKIE
        RemoveCookie(FORGOT_EMAIL_KEY);

        // ✅ REDIRECT
        navigate("/login", { replace: true });
        return;
      }

      setErrorMsg(res.data?.message || "Failed to reset password");
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
          {/* ================= LEFT INFO ================= */}
          <div className="tp-auth-info">
            <h1 className="tp-auth-title">
              Set a new <span>Password</span>
            </h1>
            <p className="tp-auth-sub">
              Enter the one-time password sent to your email and choose a new
              password to secure your account.
            </p>
          </div>

          {/* ================= RESET CARD ================= */}
          <div className="tp-card tp-auth-card">
            <div className="tp-card-header">
              <h3 className="tp-card-title">Reset Password</h3>
            </div>

            <form onSubmit={handleSubmit} className="tp-form tp-auth-form">
              {/* OTP */}
              <div className="tp-form-group">
                <label>One-Time Password (OTP)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="tp-input"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <button
                type="button"
                className="tp-auth-link"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>

              {/* NEW PASSWORD */}
              <div className="tp-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="Create a strong password"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="tp-form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* ERROR */}
              {errorMsg && (
                <div className="tp-auth-error tp-text-down">{errorMsg}</div>
              )}

              <button
                type="submit"
                className="tp-btn-primary tp-auth-btn"
                disabled={loading || buttonDisabled}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

              {/* FOOTER */}
              <p className="tp-auth-footer">
                Remembered your password?{" "}
                <span
                  className="tp-auth-link"
                  onClick={() => navigate("/login")}
                >
                  Back to login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

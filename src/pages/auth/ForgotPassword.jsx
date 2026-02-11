import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserForgotPassword } from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { SetCookie } from "../../utils/CookieManager.jsx"; 

const FORGOT_EMAIL_KEY = "tp_forgot_email";
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ===============================
     SUBMIT HANDLER
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await UserForgotPassword({ email });

      // CHECK STATUS + SUCCESS
      if (res.data?.status === 200 && res?.success === true) {
           SetCookie(FORGOT_EMAIL_KEY, email);
        navigate("/reset-password");
        return;
      }

      // fallback backend error
      setErrorMsg(res.data?.message || "Failed to send reset email");
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

      {/* LEFT INFO */}
      <div className="tp-auth-info">
        <h1 className="tp-auth-title">
          Forgot your <span>Password</span>?
        </h1>
        <p className="tp-auth-sub">
          Enter your registered email address and we’ll send you
          instructions to reset your password securely.
        </p>
      </div>

      {/* FORGOT PASSWORD CARD */}
      <div className="tp-card tp-auth-card">
        <div className="tp-card-header">
          <h3 className="tp-card-title">Password Recovery</h3>
        </div>

        <form onSubmit={handleSubmit} className="tp-form tp-auth-form">

          <div className="tp-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="tp-input"
              placeholder="you@example.com"
            />
          </div>

          {errorMsg && (
            <div className="tp-auth-error tp-text-down">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="tp-btn-primary tp-auth-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <p className="tp-auth-footer">
            Remembered your password?{" "}
            <span
              className="tp-auth-link"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </span>
          </p>

        </form>
      </div>

    </div>
  </div>
</section>

  );
};

export default ForgotPassword;

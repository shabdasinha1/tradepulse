import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserVerifyEmailOtp,
  UserResendPasswordOtp,
} from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { GetCookie, RemoveCookie } from "../../utils/CookieManager.jsx";
import {ToastContainer,  toast} from 'react-toastify';

const REGISTER_EMAIL_KEY = "tp_register_email";

const VerifyEmailOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  /* ===============================
     GET EMAIL FROM COOKIE
  ================================ */
  useEffect(() => {
    const savedEmail = GetCookie(REGISTER_EMAIL_KEY);

    if (!savedEmail) {
      // Safety fallback
      navigate("/register", { replace: true });
      return;
    }

    setEmail(savedEmail);
  }, [navigate]);

  useEffect(() => {
    // Push a dummy state so back button doesn't leave
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Force user to stay on this page
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /* ===============================
     SUBMIT OTP
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    // setLoading(true);
    toast.success("hello")
    try {
      const res = await UserVerifyEmailOtp({
        email,
        otp,
      });
      if (res.data?.status === 200 || res?.success === true) {
        // ✅ CLEANUP STORED EMAIL (COOKIE)
        RemoveCookie(REGISTER_EMAIL_KEY);

        // ✅ GO TO DASHBOARD
        navigate("/login", { replace: true });
        return;
      }
    } catch (error) {
      setErrorMsg(GetApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
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
      if(res?.success === true || res.data?.status === 200){
        toast.success(res.data.message)
      
      }
    } catch (error) {
      setErrorMsg(GetApiErrorMessage(error))
    } finally {
      setTimeout(()=>{
        setButtonDisabled(false)
      },3000)
      
    }
  };

  return (
    <section className="tp-section tp-section--auth tp-auth">
      <div className="tp-container">
        
        <div className="tp-grid tp-grid-2 tp-auth-grid">
          {/* LEFT INFO */}
          <div className="tp-auth-info">
            <h1 className="tp-auth-title">
              Verify your <span>Email</span>
            </h1>
            <p className="tp-auth-sub">
              We’ve sent a 6-digit verification code to <strong>{email}</strong>
              . Enter it below to activate your account.
            </p>
          </div>

          {/* OTP CARD */}
          <div className="tp-card tp-auth-card">
            <div className="tp-card-header">
              <h3 className="tp-card-title">Email Verification</h3>
            </div>

            <form onSubmit={handleSubmit} className="tp-form tp-auth-form">
              <div className="tp-form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="tp-input tp-otp-input"
                  placeholder="Enter 6-digit code"
                />
              </div>

              {errorMsg && (
                <div className="tp-auth-error tp-text-down">{errorMsg}</div>
              )}

              <button
                type="submit"
                className="tp-btn-primary tp-auth-btn"
                disabled={loading || buttonDisabled}

              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

            </form>
              <p className="tp-auth-footer">
                Didn’t receive the code?{" "}
                <button onClick={handleResendOtp} className="tp-auth-link">
                  Resend OTP
                </button>
              </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailOtp;

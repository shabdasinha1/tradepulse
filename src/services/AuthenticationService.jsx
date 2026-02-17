import Api from "../api/Api.jsx";

/* ===============================
   REGISTER
================================ */
export const RegisterUser = async (payload) => {
  return Api.post("/auth/register", payload);
};

/* ===============================
   VERIFY EMAIL OTP
================================ */
export const UserVerifyEmailOtp = async (payload) => {
  return Api.post("/auth/verify-email-otp", payload);
};

/* ===============================
   LOGIN
================================ */
export const LoginUser = async (payload) => {
  return Api.post("/auth/login", payload);
};

/* ===============================
   FORGOT PASSWORD
================================ */
export const UserForgotPassword = async (payload) => {
  return Api.post("/auth/forgot-password", payload);
};

/* ===============================
   RESET PASSWORD
================================ */
export const UserResetPassword = async (payload) => {
  return Api.post("/auth/reset-password", payload);
};


/* ===============================
   RESEND PASSWORD OTP
================================ */
export const UserResendPasswordOtp = async (payload) => {
  return Api.post("/auth/resend-password-otp", payload);
};



/*=============================================
      FEEDBACK FORM API
=============================================*/
export const UserFeedbackForm = async (payload)=> {
  return Api.post("/feedback/create", payload);
};
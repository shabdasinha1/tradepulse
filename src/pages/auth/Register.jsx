import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { SetCookie } from "../../utils/CookieManager.jsx";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import Select from "react-select";
import { useToast } from "../../components/common/toast/ToastProvider.jsx";

const REGISTER_EMAIL_KEY = "tp_register_email";

const Register = () => {
  const navigate = useNavigate();

  /* ===============================
     🔹 SINGLE SOURCE OF TRUTH (COUNTRIES LIST)
  ================================ */
  const [countriesList, setCountriesList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ===============================
     🔹 FORM STATE (ISO USED FOR COUNTRY)
  ================================ */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    country: "India", // ✅ ISO code (important)
    business_type: "TRADER",
    company_name: "",
    privacy_accepted: false,
    country_code: "+91",
  });

  const businessTypeOptions = [
    { value: "TRADER", label: "Trader" },
    { value: "MANUFACTURER", label: "Manufacturer" },
    { value: "EXPORTER", label: "Exporter" },
  ];

  const { addToast } = useToast();

  /* ===============================
     🔹 GENERATE FULL COUNTRY LIST
     (ISO + Name + Dial Code)
  ================================ */
  useEffect(() => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

    const list = getCountries()
      .map((iso) => ({
        label: regionNames.of(iso), // India
        value: iso, // IN
        dialCode: `+${getCountryCallingCode(iso)}`, // +91
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    setCountriesList(list);
  }, []);

  /* ===============================
     🔹 HANDLE INPUT CHANGE
  ================================ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ===============================
     🔹 REGISTER SUBMIT (UNCHANGED)
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const isFormInvalid =
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.mobile.trim() ||
      !form.password.trim() ||
      !form.company_name.trim() ||
      !form.country ||
      !form.business_type ||
      !form.country_code ||
      !form.privacy_accepted;
    if (isFormInvalid) {
      addToast("All fields are required", "error");
      setLoading(false);
      return;
    }

    try {
      if (!form.country || !form.business_type || !form.country_code) {
        addToast("Please fill all required fields", "error");
        setLoading(false);
        return;
      }

      const res = await RegisterUser(form);

      if (res.data?.status === 200 && res?.success === true) {
        SetCookie(REGISTER_EMAIL_KEY, form.email);
        navigate("/verify-email");
        return;
      }

      setErrorMsg(res?.message || "Registration failed");
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
              Create your <span>TradePulse</span> account
            </h1>
            <p className="tp-auth-sub">
              Get access to AI-powered trade insights, commodity analytics,
              suppliers, and real-time market intelligence.
            </p>
          </div>

          {/* REGISTER CARD */}
          <div className="tp-card tp-auth-card">
            <div className="tp-card-header">
              <h3 className="tp-card-title">Create Account</h3>
            </div>

            <form onSubmit={handleSubmit} className="tp-form tp-auth-form ">
              <span className="tp-form-grid">
                {/* FIRST NAME */}
                <div className="tp-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Enter First Name"
                  />
                </div>

                {/* LAST NAME */}
                <div className="tp-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Enter Last Name"
                  />
                </div>

                {/* EMAIL */}
                <div className="tp-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Enter Email"
                  />
                </div>

                {/* ===============================
                   🔥 COUNTRY CODE DROPDOWN
                   Selecting this updates BOTH fields
                ================================ */}
                <div className="tp-form-group">
                  <label>Country Code</label>
                  <Select
                    classNamePrefix="tp-input"
                    menuPortalTarget={document.body}
menuPosition="fixed"
styles={{
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
}}
                    placeholder="Select Country Code"
                    options={countriesList.map((c) => ({
                      label: `${c.value} ${c.dialCode}`, // 🔥 ISO + Dial Code
                      value: c.value,
                    }))}
                    value={
                      countriesList
                        .map((c) => ({
                          label: `${c.value} ${c.dialCode}`,
                          value: c.value,
                        }))
                        .find((opt) => {
                          const country = countriesList.find(
                            (c) => c.label === form.country,
                          );
                          return country?.value === opt.value;
                        }) || null
                    }
                    isSearchable
                    onChange={(selectedOption) => {
                      const selected = countriesList.find(
                        (c) => c.value === selectedOption?.value,
                      );

                      setForm({
                        ...form,
                        country: selected?.label || "",
                        country_code: selected?.dialCode || "",
                      });
                    }}
                  />
                </div>

                {/* MOBILE */}
                <div className="tp-form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Enter Mobile Number"
                  />
                </div>

                {/* COMPANY */}
                <div className="tp-form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Enter Company Name"
                  />
                </div>

                {/* BUSINESS TYPE */}
                <div className="tp-form-group">
                  <label>Business Type</label>
                  <Select
                    classNamePrefix="tp-input"
                    menuPortalTarget={document.body}
menuPosition="fixed"
styles={{
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
}}
                    name="business_type"
                    options={businessTypeOptions}
                    value={
                      businessTypeOptions.find(
                        (opt) => opt.value === form.business_type,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        business_type: selectedOption?.value || "",
                      })
                    }
                    placeholder="Select Business Type"
                  />
                </div>

                {/* ===============================
                   🔥 COUNTRY DROPDOWN
                   Selecting this also updates BOTH fields
                ================================ */}
                <div className="tp-form-group">
                  <label>Country</label>
                  <Select
                    classNamePrefix="tp-input"
                    menuPortalTarget={document.body}
menuPosition="fixed"
styles={{
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
}}
                    options={countriesList}
                    getOptionLabel={(option) => option.label} // 🔥 full country name
                    getOptionValue={(option) => option.value} // ISO
                    value={
                      countriesList.find((opt) => opt.label === form.country) ||
                      null
                    }
                    onChange={(selectedOption) => {
                      const selected = countriesList.find(
                        (c) => c.value === selectedOption?.value,
                      );

                      setForm({
                        ...form,
                        country: selected?.label || "",
                        country_code: selected?.dialCode || "",
                      });
                    }}
                    placeholder="Select Country"
                  />
                </div>

                {/* PASSWORD */}
                <div className="tp-form-group tp-form-span-2">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="tp-input"
                    placeholder="Create a strong password"
                  />
                </div>
              </span>

              {/* PRIVACY */}
              <div className="tp-form-group tp-form-span-2 tp-privacy">
                <label className="tp-privacy-label">
                  <input
                    type="checkbox"
                    name="privacy_accepted"
                    checked={form.privacy_accepted}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">
                      Terms of Service
                    </a>
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="tp-auth-error tp-text-down">{errorMsg}</div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="tp-btn-primary tp-auth-btn tp-form-span-2"
                disabled={loading || !form.privacy_accepted}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              {/* FOOTER */}
              <p className="tp-auth-footer tp-form-span-2">
                Already have an account?{" "}
                <span
                  className="tp-auth-link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

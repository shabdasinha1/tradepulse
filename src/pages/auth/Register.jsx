import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../services/AuthenticationService.jsx";
import { GetApiErrorMessage } from "../../utils/ErrorHandler.jsx";
import { SetCookie } from "../../utils/CookieManager.jsx";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import Select from "react-select";

const REGISTER_EMAIL_KEY = "tp_register_email";

const Register = () => {
  const navigate = useNavigate();
  const [countryCodes, setCountryCodes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    country: "india",
    business_type: "TRADER",
    company_name: "",
    privacy_accepted: false,
    country_code: "",
  });

  /* ===============================
     HANDLE CHANGE (INPUT + CHECKBOX)
  ================================ */
  let selectedCountryCode = "";
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  /* ===============================
     HANDLE SELECT ITEMS (COUNTRY CODE DROPDOWN)
  ================================ */
  const handleSelectChange = (selectedOption) => {
    // Simulate e.target
    const simulatedEvent = {
      target: {
        name: "country_code", // must match your state key
        value: selectedOption ? selectedOption.value : "", // only store value
      },
    };
    handleChange(simulatedEvent);
  };

  /* ===============================
     REGISTER SUBMIT
  ================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await RegisterUser(form);

      // ✅ CORRECT SUCCESS CHECK
      if (res.data?.status === 200 && res?.success === true) {
        // ✅ SAVE EMAIL FOR OTP PAGE
        SetCookie(REGISTER_EMAIL_KEY, form.email);

        // ✅ GO TO OTP PAGE
        navigate("/verify-email");
        return;
      }

      // ❌ fallback error from backend
      setErrorMsg(res?.message || "Registration failed");
    } catch (error) {
      setErrorMsg(GetApiErrorMessage(error));
      // console.log("error msg2 : ", errorMsg, error.response.data.details.password)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const countries = getCountries();

    const list = countries
      .map((iso) => ({
        label: `${iso} +${getCountryCallingCode(iso)}`,
        // dialCode: `+${getCountryCallingCode(iso)}`,
        value: `+${getCountryCallingCode(iso)}`,
      }))
      .sort((a, b) => a.label.localeCompare(b.iso2));

    setCountryCodes(list);
  }, []);

  return (
    <section className="tp-section tp-section--auth tp-auth">
      <div className="tp-container">
        <div className="tp-grid tp-grid-2 tp-auth-grid">
          {/* ================= LEFT INFO ================= */}
          <div className="tp-auth-info">
            <h1 className="tp-auth-title">
              Create your <span>TradePulse</span> account
            </h1>
            <p className="tp-auth-sub">
              Get access to AI-powered trade insights, commodity analytics,
              suppliers, and real-time market intelligence.
            </p>
          </div>

          {/* ================= REGISTER CARD ================= */}
          <div className="tp-card tp-auth-card">
            <div className="tp-card-header">
              <h3 className="tp-card-title">Create Account</h3>
            </div>

            <form
              onSubmit={handleSubmit}
              className="tp-form tp-auth-form tp-form-grid"
            >
              {/* ROW 1 */}
              <div className="tp-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="John"
                />
              </div>

              <div className="tp-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="Doe"
                />
              </div>

              <div className="tp-form-group">
                <label>Email Address</label>
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

              {/* COUNTRY CODE DROPDOWN */}
              <div className="tp-form-group">
                <label>Country Code</label>
                <Select
                  classNamePrefix="tp-input"
                  placeholder="Select country code"
                  options={countryCodes}
                  value={
                    countryCodes.find(
                      (opt) => opt.value === form.country_code,
                    ) || null
                  }
                  isSearchable
                  // menuIsOpen
                  name="country_code"
                  onChange={handleSelectChange}
                />
                {/* <input
                  list="countries"
                  placeholder="Select country code"
                  className="tp-input"
                  value={form.country_code}
                  onChange={handleChange}
                  required
                  name="country_code"
                />
                <datalist id="countries">
                  {countryCodes.map((item) => (
                    <option key={item.iso2} value={item.value} className="option_demo">
                
                    </option>
                  ))}
                </datalist> */}

                {/* <select
                  name="country_code"
                  className="tp-input tp-select tp-country-code-select"
                  value={form.country_code}
                  onChange={handleChange}
                  required
                >

                  <option value="">Select country code</option>

                  {countryCodes.map((item) => (
                    <option
                      key={item.iso2}
                      value={item.dialCode}
                    >
                      {item.dialCode} {item.iso2}
                    </option>
                  ))}
                </select> */}
              </div>

              {/* ROW 2 */}
              <div className="tp-form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="9876543210"
                />
              </div>

              <div className="tp-form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  className="tp-input"
                  placeholder="Your Company"
                />
              </div>

              {/* ROW 3 */}
              <div className="tp-form-group">
                <label>Business Type</label>
                <select
                  name="business_type"
                  value={form.business_type}
                  onChange={handleChange}
                  className="tp-input tp-select"
                  required
                >
                  <option value="TRADER">Trader</option>
                  <option value="MANUFACTURER">Manufacturer</option>
                  <option value="EXPORTER">Exporter</option>
                </select>
              </div>

              <div className="tp-form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="tp-input tp-select"
                  required
                >
                  <option value="india">India</option>
                  <option value="uk">United Kingdom</option>
                  <option value="uae">UAE</option>
                  <option value="usa">United States</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div className="tp-form-group tp-form-span-2">
                <label>Password</label>
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

              {/* ERROR */}
              {errorMsg && (
                <div className="tp-auth-error tp-text-down tp-form-span-2">
                  {errorMsg}
                </div>
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
import React, { useState } from "react";
import { useToast } from "../../../components/common/toast/ToastProvider";
import { UserFeedbackForm } from "../../../services/AuthenticationService";
import { GetApiErrorMessage } from "../../../utils/ErrorHandler";

const Feedback = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    role: "",
    companySize: "",
    country: "",
    challenge: "",
    dataNeed: "",
    intent: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      addToast("All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role: formData.role,
        company_size: formData.companySize,
        country: formData.country,
        challenge: formData.challenge,
        help: formData.dataNeed,
        this_platform: formData.intent,
        email: formData.email,
      };

      await UserFeedbackForm(payload);

      addToast("Thank you for your feedback!", "success");

      // Reset form
      setFormData({
        role: "",
        companySize: "",
        country: "",
        challenge: "",
        dataNeed: "",
        intent: "",
        email: "",
      });
    } catch (error) {
      const message = GetApiErrorMessage(error);
      addToast(message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <section className="tp-section tp-section--spacious">
        <div className="tp-container">

          {/* Section Header */}
          <div className="tp-section-header">
            <h2 className="tp-section-title">
              Share Your <span>Trade Insights</span>
            </h2>
            <p className="tp-section-sub">
              Help us build smarter global trade intelligence tailored for businesses like yours.
            </p>
          </div>

          {/* Card */}
          <div className="tp-card tp-feedback-page-card">
            <form className="tp-form" onSubmit={handleSubmit}>

              {/* Role */}
              <div className="tp-form-group">
                <label>Your Role</label>
                <select
                  name="role"
                  value={formData.role}
                  className="tp-input tp-select"
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  <option>Importer</option>
                  <option>Exporter</option>
                  <option>Trader</option>
                  <option>Manufacturer</option>
                  <option>SME Owner</option>
                </select>
              </div>

              {/* Company Size */}
              <div className="tp-form-group">
                <label>Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  className="tp-input tp-select"
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  <option>1–10</option>
                  <option>11–50</option>
                  <option>51–200</option>
                  <option>200+</option>
                </select>
              </div>

              {/* Country */}
              <div className="tp-form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  className="tp-input"
                  placeholder="Enter country"
                  onChange={handleChange}
                />
              </div>

              {/* Challenge */}
              <div className="tp-form-group">
                <label>Biggest Trade Challenge</label>
                <select
                  name="challenge"
                  value={formData.challenge}
                  className="tp-input tp-select"
                  onChange={handleChange}
                >
                  <option value="">Select challenge</option>
                  <option>Shipping Costs</option>
                  <option>Exchange Rate Volatility</option>
                  <option>Supplier Pricing</option>
                  <option>Regulatory Changes</option>
                  <option>Demand Forecasting</option>
                </select>
              </div>

              {/* Data Need */}
              <div className="tp-form-group">
                <label>What Data Would Help Most?</label>
                <select
                  name="dataNeed"
                  value={formData.dataNeed}
                  className="tp-input tp-select"
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option>FX Insights</option>
                  <option>Shipping Benchmarks</option>
                  <option>Price Trends</option>
                  <option>Trade Alerts</option>
                  <option>Market Intelligence</option>
                </select>
              </div>

              {/* Intent */}
              <div className="tp-form-group">
                <label>Would You Use This Platform?</label>
                <select
                  name="intent"
                  value={formData.intent}
                  className="tp-input tp-select"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>Maybe</option>
                  <option>Just Exploring</option>
                </select>
              </div>

              {/* Email */}
              <div className="tp-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="tp-input"
                  placeholder="Enter email"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="tp-btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>

            </form>
          </div>

        </div>
      </section>

  );
};

export default Feedback;

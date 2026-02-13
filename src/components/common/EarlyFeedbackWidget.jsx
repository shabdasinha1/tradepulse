import React, { useState,useEffect } from "react";

const EarlyFeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    companySize: "",
    country: "",
    challenge: "",
    dataNeed: "",
    intent: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);

    // TODO: API call here

    setIsOpen(false);
  };

  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);

  return (
    <>
      {/* Floating Button */}
{!isOpen && (
  <button
    className="tp-feedback-btn"
    onClick={() => setIsOpen(true)}
  >
    Feedback
  </button>
)}

      {/* Modal */}
      {isOpen && (
        <div className="tp-feedback-overlay">
          <div className="tp-feedback-modal tp-card">
            <div className="tp-feedback-header">
              <h3>Quick Trade Insight</h3>
              <button
                className="tp-feedback-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="tp-form" onSubmit={handleSubmit}>
              
              {/* Role */}
              <div className="tp-form-group">
                <label>Your Role</label>
                <select
                  name="role"
                  className="tp-input tp-select"
                  onChange={handleChange}
                  required
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
                  className="tp-input tp-select"
                  onChange={handleChange}
                  required
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
                  className="tp-input"
                  placeholder="Enter country"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Challenge */}
              <div className="tp-form-group">
                <label>Biggest Trade Challenge</label>
                <select
                  name="challenge"
                  className="tp-input tp-select"
                  onChange={handleChange}
                  required
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
                  className="tp-input tp-select"
                  onChange={handleChange}
                  required
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
                  className="tp-input tp-select"
                  onChange={handleChange}
                  required
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
                  className="tp-input"
                  placeholder="Enter email"
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="tp-btn-primary">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EarlyFeedbackWidget;

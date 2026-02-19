import { useState } from "react";

const Contact = () => {
  const [messageData, setMessageData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const handleChange = (e) => {
    setMessageData({ ...messageData, [e.target.name]: e.target.value });
  };

  /* ================ SUBMIT FORM ==================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("msg sent debug", messageData);
  };
  return (
    <>
      {/* ================= CONTACT HERO ================= */}
      <section
        id="contact-hero"
        className="tp-section tp-section--hero tp-contact-hero tp-contact-hero--visible"
      >
        <div className="tp-container">
          <div className="tp-contact-hero-layout">
            {/* Eyebrow */}
            <span className="tp-pill tp-pill-primary">
              Contact TradePulse AI
            </span>

            {/* Title */}
            <h1 className="tp-contact-hero-title">
              Let’s Talk About
              <br />
              <span>Smarter Trade Decisions</span>
            </h1>

            {/* Lead */}
            <p className="tp-contact-hero-lead">
              Whether you’re exploring trade intelligence, early access, or
              strategic collaboration we’re here to understand your needs and
              challenges.
            </p>

            {/* Support */}
            <p className="tp-contact-hero-support">
              We focus on insight, clarity, and risk awareness not transactions
              or marketplaces.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT PATHS ================= */}
      <section
        id="contact-paths"
        className="tp-section tp-section--spacious tp-contact-paths tp-contact-paths--visible"
      >
        <div className="tp-container">
          {/* Header */}
          <div className="tp-contact-paths-header">
            <h2 className="tp-contact-paths-title">
              How Can We <span>Help You?</span>
            </h2>

            <p className="tp-contact-paths-sub">
              Choose the option that best describes what you’re looking for.
              This helps us respond with the right context.
            </p>
          </div>

          {/* Cards */}
          <div className="tp-contact-paths-grid">
            {/* Path 1 */}
            <div className="tp-contact-path">
              <h4>Product & Early Access</h4>
              <p>
                Learn how TradePulse AI works, explore early access, or discuss
                how intelligence fits into your trade workflow.
              </p>
              <button className="tp-btn-outline">
                Request Product Discussion
              </button>
            </div>

            {/* Path 2 */}
            <div className="tp-contact-path">
              <h4>Partnerships</h4>
              <p>
                Interested in data partnerships, integrations, or collaborating
                on cross border trade intelligence?
              </p>
              <button className="tp-btn-outline">Explore Partnerships</button>
            </div>

            {/* Path 3 */}
            <div className="tp-contact-path">
              <h4>General Enquiries</h4>
              <p>
                Questions about TradePulse AI, the platform vision, or how we
                approach trade intelligence.
              </p>
              <button className="tp-btn-outline">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
      {/* ================= CONTACT FORM ================= */}
      <section
        id="contact-form"
        className="tp-section tp-section--spacious tp-contact-form tp-contact-form--visible"
      >
        <div className="tp-container">
          <div className="tp-contact-form-layout">
            {/* Header */}
            <div className="tp-contact-form-header">
              <h2 className="tp-contact-form-title">
                Send Us a <span>Message</span>
              </h2>

              <p className="tp-contact-form-sub">
                Share a bit of context and we’ll respond with the right
                information or next steps.
              </p>
            </div>

            {/* Form */}
            <form className="tp-contact-form-card" onSubmit={handleSubmit}>
              <div className="tp-form-grid">
                <div className="tp-form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    name="name"
                    onChange={handleChange}
                  />
                </div>

                <div className="tp-form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="tp-form-field">
                <label>Company (optional)</label>
                <input
                  type="text"
                  placeholder="Company or organization"
                  name="company"
                  onChange={handleChange}
                />
              </div>

              <div className="tp-form-field">
                <label>Message</label>
                <textarea
                  rows="5"
                  placeholder="Tell us what you’re exploring or the challenge you’re facing"
                  name="message"
                  onChange={handleChange}
                />
              </div>

              <div className="tp-contact-form-actions">
                <button type="submit" className="tp-btn-primary">
                  Send Message
                </button>

                <p className="tp-contact-form-note">
                  We typically respond within 1–2 business days.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= CONTACT TRUST CTA ================= */}
      <section
        id="contact-cta"
        className="tp-section tp-section--tight tp-contact-cta tp-contact-cta--visible"
      >
        <div className="tp-container">
          <div className="tp-contact-cta-layout">
            <h3 className="tp-contact-cta-title">
              Thoughtful Responses.
              <br />
              <span>No Sales Pressure.</span>
            </h3>

            <p className="tp-contact-cta-sub">
              Every message is reviewed by our team. If TradePulse AI is
              relevant to your use case, we’ll follow up with clarity and next
              steps not automated emails.
            </p>

            <div className="tp-contact-cta-meta">
              <span>Typical response time: 1–2 business days</span>
              <span>Early-stage platform • Limited onboarding</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

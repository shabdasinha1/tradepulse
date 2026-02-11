import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal.jsx";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const navigate = useNavigate();
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);
  const heroRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const featuresRef = useRef(null);
  const audienceRef = useRef(null);
  const diffRef = useRef(null);
  const visionRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  const toggleCoreItem = (index) => {
    setActiveCoreIndex((prev) => (prev === index ? null : index));
  };




  useReveal(heroRef, "tp-hero--visible");
  useReveal(problemRef, "tp-problem--visible");
  useReveal(solutionRef, "tp-solution--visible");
  useReveal(featuresRef, "tp-core--visible");
  useReveal(audienceRef, "tp-audience--visible");
  useReveal(diffRef, "tp-diff--visible");
  useReveal(visionRef, "tp-vision--visible");
  useReveal(aboutRef, "tp-about--visible");
  useReveal(ctaRef, "tp-final-cta--visible");






  return (
    <>

      {/* ================= HERO ================= */}
      <section
        id="home"
        ref={heroRef}
        className="tp-section"
      >
        <div className="tp-container">
          <div className="tp-hero-ai-wrap">

            <div className="tp-hero-ai-content">

              <span className="tp-pill tp-pill-primary">
                Global Trade Intelligence Platform
              </span>

              <h1 className="tp-hero-ai-title">
                TradePulse AI
                <br />
                <span>Smarter Global Trade Decisions</span>,
                <br />
                Powered by AI Intelligence
              </h1>

              <p className="tp-hero-ai-sub">
                Market insights, supplier intelligence, and risk signals
                for importers, exporters, SMEs, and manufacturers operating
                across global supply chains.
              </p>

              <p className="tp-hero-ai-support">
                Understand pricing trends, supplier reliability, and trade risks
                before committing capital or entering new markets.
              </p>

              <div className="tp-hero-ai-actions">
                <button
                  className="tp-btn-primary"
                  onClick={() => navigate("/register")}
                >
                  Join Early Access
                </button>

                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/login")}
                >
                  View Platform Overview
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PRODUCT VISUAL image ================= */}
      <section className="tp-section tp-section--tight tp-product-visual">
        <div className="tp-container tp-product-visual-inner">

          {/* Dark theme image */}
          <img
            src="/images/products-dark.png"
            alt="TradePulse AI Dashboard"
            className="tp-product-image tp-product-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/products-light.png"
            alt="TradePulse AI Dashboard"
            className="tp-product-image tp-product-image--light"
          />

        </div>
      </section>


      {/* ================= PROBLEM SECTION ================= */}
      <section
        id="problem"
        ref={problemRef}
        className="tp-section tp-section--spacious tp-problem"
      >
        <div className="tp-container">

          {/* Header */}
          <div className="tp-problem-header">
            <h2 className="tp-problem-title">
              Global Trade Is Complex.
              <br />
              <span>Decisions Shouldn’t Be.</span>
            </h2>

            <p className="tp-problem-intro">
              Across global trade corridors, businesses face the same challenges
              fragmented data, limited visibility, and growing risk regardless of
              geography, industry, or scale.
            </p>

          </div>

          {/* Cards */}
          <div className="tp-problem-cards">

            <div className="tp-problem-card">
              <h4>Fragmented Market Data</h4>
              <p>
                Trade intelligence scattered across regions, platforms,
                and inconsistent data sources.
              </p>
            </div>

            <div className="tp-problem-card">
              <h4>Demand & Pricing Blindspots</h4>
              <p>
                Limited visibility into real-time demand,
                pricing signals, and market momentum across regions.

              </p>
            </div>

            <div className="tp-problem-card">
              <h4>Supplier Verification Issues</h4>
              <p>
                Difficulty validating suppliers, partners,
                and counterparties across borders.
              </p>
            </div>

            <div className="tp-problem-card">
              <h4>Risk, Fraud & Decision Uncertainty</h4>
              <p>
                Lack of early warnings and reliable data increases fraud risk, failures, and costly decisions.
              </p>
            </div>


          </div>

          {/* Conclusion */}
          <div className="tp-problem-footer">
            <p className="tp-problem-impact">
              These challenges slow growth, increase risk, and prevent businesses
              especially SMEs from making confident, data backed trade decisions
              across borders.
            </p>

            <p className="tp-problem-conclusion">
              <strong>TradePulse AI was built to change that.</strong>
            </p>
          </div>

        </div>
      </section>
      {/* ================= REPORTS VISUAL ================= */}
      <section className="tp-section tp-section--tight tp-reports-visual">
        <div className="tp-container tp-reports-visual-inner">

          {/* Dark theme image */}
          <img
            src="/images/reports-dark.png"
            alt="TradePulse AI Reports & Analytics"
            className="tp-reports-image tp-reports-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/reports-light.png"
            alt="TradePulse AI Reports & Analytics"
            className="tp-reports-image tp-reports-image--light"
          />

        </div>
      </section>


      {/* ================= SOLUTION SECTION ================= */}
      <section
        id="solution"
        ref={solutionRef}
        className="tp-section tp-section--spacious tp-solution"
      >
        <div className="tp-container">

          {/* Header */}
          <div className="tp-solution-header">
            <h2 className="tp-solution-title">
              Intelligence Modules for
              <br />
              <span>Smarter Global Trade Decisions</span>
            </h2>


            <p className="tp-solution-sub">
              TradePulse AI transforms fragmented global trade data
              into actionable intelligence across markets, suppliers,
              and risk signals.
            </p>

          </div>

          {/* Intelligence Flow */}
          <div className="tp-solution-flow">

            <div className="tp-flow-line" />

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                <h4>Market Intelligence
                </h4>
                <p>
                  Pricing trends, demand signals, and trade flows
                  consolidated into a unified global market view.

                </p>
              </div>
            </div>

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                <h4>AI-Driven Insights</h4>
                <p>
                  AI models identify trends, anomalies, and early
                  signals hidden within complex trade data.

                </p>
              </div>
            </div>

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                <h4>Supplier Intelligence</h4>
                <p>
                  Verified insights into supplier behavior,
                  reliability, and historical trade performance
                  across regions.
                </p>
              </div>
            </div>

            <div className="tp-flow-step">
              <span className="tp-flow-dot" />
              <div className="tp-flow-content">
                <h4>Risk & Anomaly Detection</h4>
                <p>
                  Early alerts on supply risk, compliance issues,
                  and unusual trade patterns before commitments are made.

                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <p className="tp-solution-footer">
            All delivered through a unified decision-support platform
            built for importers, exporters, and global trade operators.
          </p>


        </div>
      </section>

      {/* ================= FORECAST VISUAL ================= */}
      <section className="tp-section tp-section--tight tp-forecast-visual">
        <div className="tp-container tp-forecast-visual-inner">

          {/* Dark theme image */}
          <img
            src="/images/forecast-dark.png"
            alt="TradePulse AI Forecast & Predictive Analytics"
            className="tp-forecast-image tp-forecast-image--dark"
          />

          {/* Light theme image */}
          <img
            src="/images/forecast-light.png"
            alt="TradePulse AI Forecast & Predictive Analytics"
            className="tp-forecast-image tp-forecast-image--light"
          />

        </div>
      </section>

      {/* ================= CORE FEATURES ================= */}
      <section
        id="features"
        ref={featuresRef}
        className="tp-section tp-section--spacious tp-core"
      >
        <div className="tp-container">

          {/* Header */}
          <div className="tp-core-header">
            <h2 className="tp-core-title">
              Intelligence <span>Capabilities</span>
            </h2>
            <p className="tp-core-sub">
              TradePulse AI provides actionable intelligence across markets,
              suppliers, and risk helping teams make informed trade decisions
              before taking action.
            </p>
          </div>

          {/* Accordion */}
          <div className="tp-core-accordion">

            {/* Item 1 */}
            <div className={`tp-core-item ${activeCoreIndex === 0 ? "active" : ""}`}>
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(0)}
                type="button"
              >
                <span className="tp-core-index">01</span>
                <span className="tp-core-heading">Market Intelligence</span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Understand demand, pricing trends, and market signals across regions.

                </p>
                <ul>
                  <li> Identify emerging demand trends across markets  </li>
                  <li>Track pricing movements and volatility  </li>
                  <li>Compare regional opportunities before expansion</li>
                </ul>
              </div>
            </div>

            {/* Item 2 */}
            <div className={`tp-core-item ${activeCoreIndex === 1 ? "active" : ""}`}>
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(1)}
                type="button"
              >
                <span className="tp-core-index">02</span>
                <span className="tp-core-heading">
                  Supplier Intelligence & Verification
                </span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Evaluate who you trade with before committing to a supplier.

                </p>
                <ul>
                  <li>Supplier credibility and profiling  </li>
                  <li>Risk indicators derived from trade behavior  </li>
                  <li>Visibility into historical supplier performance</li>
                </ul>
              </div>
            </div>

            {/* Item 3 */}
            <div className={`tp-core-item ${activeCoreIndex === 2 ? "active" : ""}`}>
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(2)}
                type="button"
              >
                <span className="tp-core-index">03</span>
                <span className="tp-core-heading">AI-Generated Insights</span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Turn complex trade data into clear, actionable insights.
                </p>
                <ul>
                  <li>AI-generated trade summaries and signals  </li>
                  <li>Pattern recognition across markets and corridors  </li>
                  <li>Early detection of anomalies and emerging risks</li>
                </ul>
              </div>
            </div>

            {/* Item 4 */}
            <div className={`tp-core-item ${activeCoreIndex === 3 ? "active" : ""}`}>
              <button
                className="tp-core-trigger"
                onClick={() => toggleCoreItem(3)}
                type="button"
              >
                <span className="tp-core-index">04</span>
                <span className="tp-core-heading">Risk & Anomaly Detection</span>
                <span className="tp-core-icon">+</span>
              </button>

              <div className="tp-core-panel">
                <p className="tp-core-desc">
                  Reduce uncertainty in cross-border trade decisions.
                </p>
                <ul>
                  <li>Flag unusual trade and pricing patterns</li>
                  <li>Identify potential compliance or reliability risks </li>
                  <li>Support safer, more informed execution</li>
                </ul>
              </div>
            </div>

          </div>


        </div>
      </section>



      {/* ================= FINAL CTA ================= */}
      <section
        id="contact"
        ref={ctaRef}
        className=" tp-section--cta tp-section--spacious tp-final-cta"
      >
        <div className="tp-container">

          <div className="tp-final-cta-layout">

            <h2 className="tp-final-cta-title">
              Explore the Future of
              <br />
              <span>Global Trade Intelligence</span>
            </h2>

            <p className="tp-final-cta-sub">
              TradePulse AI is built for teams that want clarity
              before commitment and intelligence before execution.
              Join us as we shape the platform together.
            </p>


            <div className="tp-final-cta-actions">
              <button
                className="tp-btn-primary tp-final-cta-primary"
                onClick={() => navigate("/register")}
              >
                Join Early Access
              </button>

              <div className="tp-final-cta-secondary">
                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/contact")}
                >
                  Request a Demo
                </button>

                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/contact")}
                >
                  Share Feedback / Partner
                </button>
                <button
                  className="tp-btn-outline"
                  onClick={() => navigate("/roadmap")}
                >
                  View Roadmap
                </button>
              </div>
            </div>


          </div>

        </div>
      </section>



    </>
  );
};

export default Home;

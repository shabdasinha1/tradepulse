import { useNavigate } from "react-router-dom";


const About = () => {
  const navigate = useNavigate();



  return (
    <>
    {/*------------ HERO SECTION ------------ */}
    <section
  id="about-hero"
  className="tp-section tp-section--hero tp-about-hero tp-about-hero--visible"
>
  <div className="tp-container">

    <div className="tp-about-hero-layout">

      {/* Eyebrow */}
      <span className="tp-pill tp-pill-primary">
        About TradePulse AI
      </span>

      {/* Title */}
      <h1 className="tp-about-hero-title">
        Building <span>Decision Intelligence</span>
        <br />
        for Cross Border Trade
      </h1>

      {/* Lead */}
      <p className="tp-about-hero-lead">
        TradePulse AI exists to help businesses navigate cross border trade
        complexity with clarity transforming fragmented data into
        intelligence that supports better decisions.
      </p>

      {/* Support */}
      <p className="tp-about-hero-support">
        We don’t facilitate transactions or operate marketplaces.
        We focus on intelligence, insight, and risk awareness before decisions are made.
      </p>

    </div>

  </div>
</section>
{/* ================= ABOUT HERO VISUAL ================= */}
<section className="tp-section tp-section--tight tp-about-visual">
  <div className="tp-container tp-about-visual-inner">

    {/* Dark theme image */}
    <img
      src="/images/about1-dark.webp"
      alt="TradePulse AI Decision Intelligence Platform"
      className="tp-about-image tp-about-image--dark"
    />

    {/* Light theme image */}
    <img
      src="/images/about1-light.webp"
      alt="TradePulse AI Decision Intelligence Platform"
      className="tp-about-image tp-about-image--light"
    />

  </div>
</section>

{/*---------------- Who It’s For ----------------- */}
<section
  id="who-its-for"
  className="tp-section tp-section--spacious tp-audience tp-audience--visible"
>
  <div className="tp-container">

    {/* Header */}
    <div className="tp-audience-header">
      <h2 className="tp-audience-title">
        Built for <span>Teams Operating in Cross Border Trade</span>
      </h2>

      <p className="tp-audience-sub">
        TradePulse AI supports businesses that rely on understanding
        markets, suppliers, and trade risk across borders especially
        where decisions carry financial or operational impact.
      </p>
    </div>

    {/* Signal Cloud */}
    <div className="tp-audience-cloud">
      <span className="tp-audience-signal">Importers & Exporters</span>
      <span className="tp-audience-signal">Manufacturers & SMEs</span>
      <span className="tp-audience-signal">Supply Chain Operators</span>
      <span className="tp-audience-signal">Procurement & Sourcing Teams</span>
      <span className="tp-audience-signal">Trade-Focused Startups</span>
      <span className="tp-audience-signal">Trade Finance & Advisory Firms</span>
    </div>

    {/* Footer */}
    <p className="tp-audience-footer">
      If your business depends on understanding markets, suppliers,
      and trade risk <strong>TradePulse AI is built for you.</strong>
    </p>

  </div>
</section>

{/*--------------- Differentiation Section ------------ */}
<section
  id="why-tradepulse"
  className="tp-section tp-section--spacious tp-diff tp-diff--visible"
>
  <div className="tp-container">

    <div className="tp-diff-layout">

      {/* Hero statement */}
      <div className="tp-diff-hero">
        <h2 className="tp-diff-title">
          Not a Marketplace.
          <br />
          <span>A Decision Intelligence Platform.</span>
        </h2>

        <p className="tp-diff-lead">
          TradePulse AI is designed to help businesses
          <strong> understand, evaluate, and act</strong>
          on cross border trade signals before execution.
        </p>
      </div>

      {/* Contrast narrative */}
      <div className="tp-diff-narrative">

        <div className="tp-diff-noise">
          <p className="tp-diff-label">What most platforms provide</p>
          <ul>
            <li>Marketplaces without decision context</li>
            <li>Large volumes of unstructured trade data</li>
            <li>Signals buried inside noise and volume</li>
          </ul>
        </div>

        <div className="tp-diff-divider-vertical" />

        <div className="tp-diff-signal">
          <p className="tp-diff-label">What TradePulse AI delivers</p>
          <p className="tp-diff-signal-text">
            Structured intelligence that explains
            <strong> what matters, why it matters,</strong>
            and <strong>where risk or opportunity is emerging</strong>
            {" "}across cross border trade activity.
          </p>
        </div>

      </div>

      {/* Bottom emphasis */}
      <div className="tp-diff-conclusion">
        <p className="tp-diff-emphasis">
          We don’t execute trades.
          <br />
          <strong>We sharpen decisions before execution.</strong>
        </p>

        <p className="tp-diff-footer">
          TradePulse AI integrates alongside your existing tools,
          adding intelligence and clarity as trade complexity increases.
        </p>
      </div>

    </div>

  </div>
</section>
{/* ================= ABOUT CONTEXT VISUAL ================= */}
<section className="tp-section tp-section--tight tp-about-context-visual">
  <div className="tp-container tp-about-context-inner">

    {/* Dark theme image */}
    <img
      src="/images/about2-dark.webp"
      alt="TradePulse AI Decision Intelligence Overview"
      className="tp-about-context-image tp-about-context-image--dark"
    />

    {/* Light theme image */}
    <img
      src="/images/about2-light.webp"
      alt="TradePulse AI Decision Intelligence Overview"
      className="tp-about-context-image tp-about-context-image--light"
    />

  </div>
</section>

{/*---------- Vision & Scale Section ----------- */}
<section
  id="vision"
  className="tp-section tp-section--spacious tp-vision tp-vision--visible"
>
  <div className="tp-container">

    <div className="tp-vision-layout">

      {/* Title */}
      <h2 className="tp-vision-title">
        A Scalable Intelligence Platform
        <br />
        <span>for Smarter Cross Border Trade</span>
      </h2>

      {/* Lead */}
      <p className="tp-vision-lead">
        TradePulse AI is designed to scale across industries,
        regions, and cross border trade corridors providing
        consistent intelligence as trade complexity grows.
      </p>

      {/* Vision Signals */}
      <div className="tp-vision-signals">
        <span>Trusted Data</span>
        <span>Actionable Insight</span>
        <span>Early Risk Awareness</span>
      </div>

      {/* Horizon statement */}
      <p className="tp-vision-horizon">
        Our long term vision is to become a trusted intelligence layer
        for cross border trade helping businesses make smarter, safer,
        and more confident cross border decisions worldwide.
      </p>

    </div>

  </div>
</section>

{/*-------------- Founder / Origin ------------ */}
<section
  id="about"
  className="tp-section tp-section--spacious tp-about tp-about--visible"
>
  <div className="tp-container">

    <div className="tp-about-layout">

      {/* Title */}
      <h2 className="tp-about-title">
        Built From <span>Real Trade Experience</span>
      </h2>

      {/* Narrative */}
      <div className="tp-about-content">
        <p>
          TradePulse AI was founded by a team with direct experience in
          international trade, technology, and data analysis.
        </p>

        <p>
          Having operated across multiple markets and supply chains,
          we’ve seen first hand how fragmented data and limited visibility
          increase risk, slow decisions, and restrict growth.
        </p>

        <p className="tp-about-emphasis">
          TradePulse AI brings together technology, data, and real-world
          trade understanding into an intelligence platform designed to
          support better decisions in today’s cross border economy.
        </p>
      </div>

      {/* Credibility stack (visual metaphor) */}
      <div className="tp-about-stack">
        <div className="tp-about-layer layer-1" />
        <div className="tp-about-layer layer-2" />
        <div className="tp-about-layer layer-3" />
      </div>

    </div>

  </div>
</section>

{/*-------------- CTA ----------- */}
<section
  id="about-cta"
  className="tp-section tp-section--cta tp-about-cta tp-about-cta--visible" 
>
  <div className="tp-container">

    <div className="tp-about-cta-layout">

      {/* Title */}
      <h2 className="tp-about-cta-title">
        Explore Trade Intelligence,
        <br />
        <span>Without the Noise</span>
      </h2>

      {/* Subtext */}
      <p className="tp-about-cta-sub">
        TradePulse AI is being shaped in collaboration with early users,
        partners, and industry experts. If you’re navigating complex
        trade decisions, we’d like to hear from you.
      </p>

      {/* Actions */}
      <div className="tp-about-cta-actions">
  <button
    className="tp-btn-primary"
    onClick={() => navigate("/contact")}
  >
    Talk to Us
  </button>

  <button
    className="tp-btn-outline"
    onClick={() => navigate("/register")}
  >
    Join Early Access
  </button>
</div>


    </div>

  </div>
</section>






    </>
  );
};

export default About;

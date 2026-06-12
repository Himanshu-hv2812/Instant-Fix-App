const Home = ({ showPage, openBooking }) => {
  const services = [
    { emoji: '⚡', name: 'Electrician', desc: 'Wiring, short circuits, MCB tripping, fan installation & emergency fixes.', price: 'Starting ₹199 · Avg. 25 min arrival' },
    { emoji: '🔧', name: 'Plumber', desc: 'Pipe leaks, blockages, tap repair, water heater & drain cleaning.', price: 'Starting ₹149 · Avg. 20 min arrival' },
    { emoji: '🚗', name: 'Car Mechanic', desc: 'Flat tyre, battery jump, oil change, brake check & diagnostics.', price: 'Starting ₹299 · Avg. 35 min arrival' },
    { emoji: '🚽', name: 'Toilet Cleaning', desc: 'Deep cleaning, sanitizing, odour removal & disinfection.', price: 'Starting ₹249 · Avg. 30 min arrival' },
    { emoji: '📺', name: 'Appliance Repair', desc: 'AC, washing machine, refrigerator, microwave & TV repair.', price: 'Starting ₹349 · Avg. 40 min arrival' },
    { emoji: '🏠', name: 'House Cleaning', desc: 'Full home deep clean, kitchen, bathroom & post-renovation cleanup.', price: 'Starting ₹499 · Avg. 45 min arrival' },
  ]

  return (
    <div className="page active" id="page-home">

      {/* Hero */}
      <section className="hero fade-in">
        <div>
          <div className="hero-badge">AI-Powered Services • Live in Lucknow</div>
          <h1>Fix It <span>Instantly</span>,<br/>Anywhere.</h1>
          <p className="hero-sub">On-demand home services powered by AI. Electricians, plumbers, mechanics & more — vetted professionals at your doorstep in minutes.</p>
          <div className="hero-actions">
            <button className="btn-lg btn-primary" onClick={() => showPage('booking')}>⚡ Book a Service</button>
            <button className="btn-lg btn-outline" onClick={() => showPage('tracking')}>📍 Live Tracking</button>
          </div>
          <div className="stats">
            <div className="stat-item"><div className="stat-num">Revisit Policy</div><div className="stat-label"></div></div>
            <div className="stat-item"><div className="stat-num">Transparent pricing</div><div className="stat-label"></div></div>
            <div className="stat-item"><div className="stat-num"></div><div className="stat-label"></div></div>
            <div className="stat-item"><div className="stat-num">24/7</div><div className="stat-label">Emergency Support</div></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="live-label">🔴 Live Activity</div>
          <div className="live-card">
            <div className="lc-icon orange">⚡</div>
            <div><div className="lc-name">Electrician Dispatch</div><div className="lc-sub">Sector 14, Lucknow • Rajesh K.</div></div>
            <div className="lc-right"><div className="lc-status status-live">● Live</div></div>
          </div>
          <div className="live-card">
            <div className="lc-icon blue">🔧</div>
            <div><div className="lc-name">Plumber Assigned</div><div className="lc-sub">Aliganj, Lucknow • Suresh M.</div></div>
            <div className="lc-right"><div className="lc-status status-eta">ETA 8 min</div></div>
          </div>
          <div className="live-card">
            <div className="lc-icon green">🏠</div>
            <div><div className="lc-name">House Cleaning Done</div><div className="lc-sub">Gomti Nagar • Priya S.</div></div>
            <div className="lc-right"><div className="lc-status status-done">✓ Complete</div></div>
          </div>
          <div className="ai-info-box">
            🤖 <strong>AI Engine</strong> matched 47 bookings in the last hour with 98.2% satisfaction rate.
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="section-header">
          <h2>Services We Offer</h2>
          <p>6 essential categories, hundreds of verified professionals</p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.name} className="service-card" onClick={() => openBooking(s.name)}>
              <span className="sc-emoji">{s.emoji}</span>
              <div className="sc-name">{s.name}</div>
              <div className="sc-desc">{s.desc}</div>
              <div className="sc-price">{s.price}</div>
              <button className="sc-book">Book Now →</button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div className="section-header">
            <h2>How It Works</h2>
            <p>4 simple steps to get your problem fixed</p>
          </div>
          <div className="steps">
            {[
              { n:'1', title:'Select Service', desc:'Choose the service you need from our 6 categories in just a few taps.' },
              { n:'2', title:'AI Matches Pro', desc:'Our AI finds the best nearby technician based on rating, urgency & location.' },
              { n:'3', title:'Confirm Booking', desc:'Review the details, see transparent pricing, and confirm instantly.' },
              { n:'4', title:'Track & Pay', desc:'Live-track your technician and pay securely once done.' },
            ].map((step) => (
              <div key={step.n} className="step">
                <div className="step-num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="section">
        <div className="section-header">
          <h2>Powered by AI</h2>
          <p>Smarter, faster, better service matching</p>
        </div>
        <div className="ai-grid">
          {[
            { icon:'🎯', title:'Smart Matching', text:'Matches users with the right professional using location, rating, urgency, and service type.' },
            { icon:'📊', title:'Demand Prediction', text:'Forecasts service demand to improve availability and reduce wait times during peak hours.' },
            { icon:'🤖', title:'Chatbot Assistance', text:'Instant help for common questions, booking guidance, and real-time service updates.' },
            { icon:'🛡️', title:'Fraud Detection', text:'Monitors activity patterns to detect suspicious behaviour and protect users and professionals.' },
          ].map((f) => (
            <div key={f.title} className="ai-card">
              <div className="ai-icon">{f.icon}</div>
              <div>
                <div className="ai-title">{f.title}</div>
                <div className="ai-text">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <strong>Instant Fix</strong> · Built by ShadowCoders · WEB NOVA 2026<br/>
        <span>AI-Powered On-Demand Service Platform · Starting in Lucknow</span>
      </footer>

    </div>
  )
}

export default Home
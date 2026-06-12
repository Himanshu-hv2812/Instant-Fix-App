import { useEffect, useRef } from 'react'

const Tracking = ({ showPage }) => {
  const countdownRef = useRef(null)

  useEffect(() => {
    let val = 12
    const el = document.getElementById('countdown')
    countdownRef.current = setInterval(() => {
      val--
      if (el) el.textContent = val + ' min'
      if (val <= 0) {
        clearInterval(countdownRef.current)
        if (el) el.textContent = 'Arriving now!'
      }
    }, 10000)
    return () => clearInterval(countdownRef.current)
  }, [])

  return (
    <div className="page active" id="page-tracking">
      <div className="tracking-page fade-in">
        <div className="track-header">
          <div>
            <h2 className="page-title">Live Tracking</h2>
            <div className="booking-id">Booking <strong>#IFX-2847</strong></div>
          </div>
          <div className="status-pill">● On The Way</div>
        </div>

        <div className="map-container">
          <div className="map-bg"></div>
          <div className="map-pin home">🏠</div>
          <div className="map-pin tech">👨‍🔧</div>
          <div className="map-route"></div>
          <div className="map-label">📍 Rajesh Kumar is heading to your location</div>
        </div>

        <div className="live-status">
          <div className="ls-dot"></div>
          <div className="ls-main">
            <div className="ls-title">Rajesh Kumar is on the way</div>
            <div className="ls-sub">⚡ Electrician · ⭐ 4.9 · 8 years experience · 🚗 On two-wheeler</div>
          </div>
          <div className="ls-eta">
            <div id="countdown">12 min</div>
            <span>Estimated Arrival</span>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-tile">
            <div className="it-label">Service</div>
            <div className="it-val">⚡ Electrician</div>
            <div className="it-sub">MCB Tripping Fix</div>
          </div>
          <div className="info-tile">
            <div className="it-label">Estimate</div>
            <div className="it-val accent">₹399</div>
            <div className="it-sub">Incl. ₹49 platform fee</div>
          </div>
          <div className="info-tile">
            <div className="it-label">Technician Contact</div>
            <div className="it-val">📞 Call</div>
            <div className="it-sub">+91 98001 XXXXX</div>
          </div>
        </div>

        <div className="timeline-box">
          <div className="timeline-label">Journey Progress</div>
          <div className="track-steps">
            {[
              { dot:'done', label:'Booking Confirmed', time:'2:34 PM' },
              { dot:'done', label:'Technician Accepted', time:'2:35 PM' },
              { dot:'active', label:'On The Way', time:'Since 2:36 PM' },
              { dot:'', label:'Work in Progress', time:'Pending' },
              { dot:'', label:'Job Complete & Paid', time:'Pending' },
            ].map((s, i) => (
              <div key={i} className="track-step">
                <div className={`ts-dot ${s.dot}`}>{s.dot === 'done' ? '✓' : s.dot === 'active' ? '→' : s.label === 'Work in Progress' ? '🛠️' : '✅'}</div>
                <div>
                  <div className="ts-label">{s.label}</div>
                  <div className="ts-time">{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="track-actions">
          <button className="btn-lg btn-outline" onClick={() => showPage('home')}>← Home</button>
          <button className="btn-lg btn-primary" onClick={() => showPage('booking')}>+ New Booking</button>
        </div>
      </div>
    </div>
  )
}

export default Tracking
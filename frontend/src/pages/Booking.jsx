import { useState, useEffect } from 'react'

const Booking = ({ showPage, selectedService, setSelectedService, bookingStep, setBookingStep, urgency, setUrgency }) => {
  const [techName, setTechName] = useState('')
  const [techPrice, setTechPrice] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [desc, setDesc] = useState('')
  const [time, setTime] = useState('')
  const [payMethod, setPayMethod] = useState('UPI')
  const [aiMatching, setAiMatching] = useState(false)
  const [showTechs, setShowTechs] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const services = [
    '⚡ Electrician', '🔧 Plumber', '🚗 Car Mechanic',
    '🚽 Toilet Cleaning', '📺 Appliance Repair', '🏠 House Cleaning'
  ]

  const techs = [
    { name: 'Rajesh Kumar', exp: '8 yrs exp', dist: '1.2 km away', rating: '4.9', eta: '12 min', price: '350', topPick: true, avatar: '👨‍🔧' },
    { name: 'Suresh Yadav', exp: '5 yrs exp', dist: '2.1 km away', rating: '4.7', eta: '18 min', price: '299', topPick: false, avatar: '👷' },
    { name: 'Amit Singh', exp: '12 yrs exp', dist: '3.4 km away', rating: '4.8', eta: '25 min', price: '420', topPick: false, avatar: '🧑‍🔧' },
  ]

  const goToStep = (n) => {
    if (n === 2 && !selectedService) { alert('Please select a service first.'); return }
    if (n === 3) {
      setAiMatching(true)
      setShowTechs(false)
      setTimeout(() => { setAiMatching(false); setShowTechs(true) }, 1800)
    }
    setBookingStep(n)
    window.scrollTo(0, 0)
  }

  const confirmBooking = async () => {
    try {
      // 1. Pack up the state into an object for the database
      const bookingData = {
        service: selectedService,
        urgency: urgency,
        tech: techName,
        techPrice: techPrice,
        name: name,
        address: address
      };

      // 2. Send it to your local backend
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Booking Saved to Local MongoDB:', data);
        setConfirmed(true); // Show the success UI
      } else {
        alert('Database Error: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Failed to connect to backend:', error);
      alert('Could not connect to database. Is the local Node server running?');
    }
  }

  const totalPrice = techPrice ? parseInt(techPrice) + 49 : 0

  return (
    <div className="page active" id="page-booking">
      <div className="booking-container">
        <h2 className="page-title">Book a Service</h2>
        <p className="page-sub">Quick, transparent, AI-matched professionals</p>

        {/* Progress Steps */}
        <div className="booking-steps">
          {['Service', 'Details', 'Technician', 'Confirm'].map((label, i) => (
            <div key={label} className={`bstep ${bookingStep === i+1 ? 'active' : bookingStep > i+1 ? 'done' : ''}`}>
              <div className="bstep-circle">{i+1}</div>
              <div className="bstep-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {bookingStep === 1 && (
          <div className="booking-panel">
            <div className="bp-title">What do you need fixed?</div>
            <div className="bp-sub">Select a service category to get started</div>
            <div className="form-group">
              <label className="form-label">Service Type</label>
              <div className="service-chips">
                {services.map((s) => (
                  <button
                    key={s}
                    className={`chip ${selectedService === s.split(' ').slice(1).join(' ') ? 'selected' : ''}`}
                    onClick={() => setSelectedService(s.split(' ').slice(1).join(' '))}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Urgency</label>
              <div className="urgency-btns">
                {[
                  { type:'Scheduled', icon:'📅', time:'Set a time', cls:'' },
                  { type:'Urgent', icon:'⚡', time:'Within 2 hours', cls:'' },
                  { type:'Emergency', icon:'🚨', time:'ASAP', cls:'emergency' },
                ].map((u) => (
                  <button
                    key={u.type}
                    className={`urgency-btn ${u.cls} ${urgency === u.type ? 'selected' : ''}`}
                    onClick={() => setUrgency(u.type)}
                  >
                    <span className="ub-icon">{u.icon}</span>
                    <div className="ub-label">{u.type}</div>
                    <div className="ub-time">{u.time}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="nav-btns">
              <button className="btn-back" onClick={() => showPage('home')}>← Back</button>
              <button className="btn-next" onClick={() => goToStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {bookingStep === 2 && (
          <div className="booking-panel">
            <div className="bp-title">Your Details</div>
            <div className="bp-sub">Tell us more about the issue and your location</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" type="text" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" type="text" placeholder="Flat 3B, Indira Nagar, Lucknow" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Time</label>
              <input className="form-input" type="datetime-local" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Describe the Issue</label>
              <textarea className="form-textarea" placeholder="e.g. Kitchen lights stopped working..." value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="nav-btns">
              <button className="btn-back" onClick={() => goToStep(1)}>← Back</button>
              <button className="btn-next" onClick={() => goToStep(3)}>Find Technicians →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {bookingStep === 3 && (
          <div className="booking-panel">
            <div className="bp-title">AI-Matched Technicians</div>
            <div className="bp-sub">Best professionals near you, ranked by rating & proximity</div>
            {aiMatching && (
              <div className="ai-matching">
                <div className="spin-icon">⚙️</div>
                <div>AI matching nearby professionals...</div>
              </div>
            )}
            {showTechs && (
              <div className="tech-cards">
                {techs.map((t) => (
                  <div
                    key={t.name}
                    className={`tech-card ${techName === t.name ? 'selected' : ''}`}
                    onClick={() => { setTechName(t.name); setTechPrice(t.price) }}
                  >
                    <div className="tech-avatar">{t.avatar}</div>
                    <div>
                      <div className="tech-name">{t.name}</div>
                      <div className="tech-meta">{t.exp} · {t.dist}</div>
                      {t.topPick && <div className="ai-badge">🤖 AI Top Pick</div>}
                    </div>
                    <div className="tech-right">
                      <div className="tech-rating">⭐ {t.rating}</div>
                      <div className="tech-eta">ETA {t.eta}</div>
                      <div className="tech-price">₹{t.price} est.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="nav-btns" style={{marginTop:'28px'}}>
              <button className="btn-back" onClick={() => goToStep(2)}>← Back</button>
              <button className="btn-next" onClick={() => goToStep(4)}>Confirm Booking →</button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {bookingStep === 4 && (
          <div className="booking-panel">
            {!confirmed ? (
              <div>
                <div className="bp-title">Review & Pay</div>
                <div className="bp-sub">Almost there! Review your booking summary</div>
                <div className="summary-box">
                  <div className="summary-row"><span className="sr-label">Service</span><span className="sr-val">{selectedService || '—'}</span></div>
                  <div className="summary-row"><span className="sr-label">Urgency</span><span className="sr-val">{urgency || '—'}</span></div>
                  <div className="summary-row"><span className="sr-label">Technician</span><span className="sr-val">{techName || '—'}</span></div>
                  <div className="summary-row"><span className="sr-label">Address</span><span className="sr-val">{address || 'Your Location'}</span></div>
                  <div className="summary-row"><span className="sr-label">Platform Fee</span><span className="sr-val">₹49</span></div>
                  <div className="summary-row"><span className="sr-label" style={{fontWeight:'700'}}>Total Estimate</span><span className="sr-val summary-total">₹{totalPrice}</span></div>
                </div>
                <label className="form-label">Payment Method</label>
                <div className="payment-methods">
                  {[{icon:'📱',label:'UPI'},{icon:'💳',label:'Card'},{icon:'💵',label:'Cash'},{icon:'🏦',label:'Net Banking'}].map((pm) => (
                    <button key={pm.label} className={`pm-btn ${payMethod === pm.label ? 'selected' : ''}`} onClick={() => setPayMethod(pm.label)}>
                      <span>{pm.icon}</span>{pm.label}
                    </button>
                  ))}
                </div>
                <div className="nav-btns">
                  <button className="btn-back" onClick={() => goToStep(3)}>← Back</button>
                  <button className="btn-next confirm-btn" onClick={confirmBooking}>✓ Confirm & Pay</button>
                </div>
              </div>
            ) : (
              <div className="confirm-screen">
                <div className="confirm-icon">✓</div>
                <div className="confirm-title">Booking Confirmed!</div>
                <div className="confirm-sub">Your technician is on the way. Booking ID: <strong>#IFX-2847</strong></div>
                <div className="tracking-card">
                  <div className="tc-label">Live Status</div>
                  <div className="track-steps">
                    {[
                      { dot:'done', label:'Booking Confirmed', time:'Just now' },
                      { dot:'done', label:'Technician Assigned', time:'1 min ago' },
                      { dot:'active', label:'On the Way', time:'ETA ~12 min' },
                      { dot:'', label:'Service Complete', time:'Pending' },
                    ].map((s, i) => (
                      <div key={i} className="track-step">
                        <div className={`ts-dot ${s.dot}`}>{s.dot === 'done' ? '✓' : s.dot === 'active' ? '→' : '🏠'}</div>
                        <div><div className="ts-label">{s.label}</div><div className="ts-time">{s.time}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="confirm-actions">
                  <button className="btn-lg btn-primary" onClick={() => showPage('tracking')}>📍 Track Live</button>
                  <button className="btn-lg btn-outline" onClick={() => showPage('home')}>Back to Home</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Booking
import { useState, useEffect } from 'react'

const Booking = ({ showPage, selectedService, setSelectedService, bookingStep, setBookingStep, urgency, setUrgency }) => {
  const [techName, setTechName] = useState('')
  const [techPrice, setTechPrice] = useState('')
  const [time, setTime] = useState('')
  const [payMethod, setPayMethod] = useState('UPI')
  const [aiMatching, setAiMatching] = useState(false)
  const [showTechs, setShowTechs] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  // Form & Validation States
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [desc, setDesc] = useState('')
  const [errors, setErrors] = useState({})

  // OTP States
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

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
      let newErrors = {}

      // 1. Strict Validation
      if (!name.trim()) newErrors.name = 'Name is required.'
      const digitsOnly = phone.replace(/\D/g, '')
      if (digitsOnly.length !== 10) newErrors.phone = 'Please enter a valid 10-digit phone number.'
      if (!address.trim()) newErrors.address = 'Address is required.'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setErrors({})

      // 2. OTP Verification Flow
      if (!otpVerified) {
        if (!otpSent) {
          setOtpSent(true) // Show the OTP input
          return
        } else {
          if (otp !== '1234') { // Hardcoded for hackathon demo
            setErrors({ otp: 'Invalid OTP. For demo, enter 1234.' })
            return
          }
          setOtpVerified(true) // OTP Success!
        }
      }

      // 3. Proceed to AI Matching
      setAiMatching(true)
      setShowTechs(false)
      setTimeout(() => { setAiMatching(false); setShowTechs(true) }, 1800)
    }

    setBookingStep(n)
    window.scrollTo(0, 0)
  }

  const confirmBooking = async () => {
    try {
      const bookingData = {
        service: selectedService,
        urgency: urgency,
        tech: techName,
        techPrice: techPrice,
        name: name,
        address: address,
        phone: phone // Sending phone to DB
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Booking Saved to Local MongoDB:', data);
        setConfirmed(true);
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

        {/* Step 1: Service */}
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

        {/* Step 2: Details & OTP */}
        {bookingStep === 2 && (
          <div className="booking-panel">
            <div className="bp-title">Your Details</div>
            <div className="bp-sub">Tell us more about the issue and your location</div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" type="text" placeholder="Rahul Sharma" value={name} onChange={e => setName(e.target.value)} disabled={otpSent} />
                {errors.name && <span style={{color:'#ff3b3b', fontSize:'12px', marginTop:'6px', display:'block'}}>{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="9876543210" maxLength="10" value={phone} onChange={e => setPhone(e.target.value)} disabled={otpSent} />
                {errors.phone && <span style={{color:'#ff3b3b', fontSize:'12px', marginTop:'6px', display:'block'}}>{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" type="text" placeholder="Flat 3B, Indira Nagar, Lucknow" value={address} onChange={e => setAddress(e.target.value)} disabled={otpSent} />
              {errors.address && <span style={{color:'#ff3b3b', fontSize:'12px', marginTop:'6px', display:'block'}}>{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Describe the Issue (Optional)</label>
              <textarea className="form-textarea" placeholder="e.g. Kitchen lights stopped working..." value={desc} onChange={e => setDesc(e.target.value)} disabled={otpSent} />
            </div>

            {/* 🔥 OTP SECTION 🔥 */}
            {otpSent && !otpVerified && (
              <div className="form-group fade-in" style={{ padding: '20px', background: 'rgba(255, 107, 43, 0.05)', border: '1px solid rgba(255, 107, 43, 0.3)', borderRadius: '14px', marginTop: '24px' }}>
                <label className="form-label" style={{ color: 'var(--accent)' }}>Enter OTP sent to +91 {phone}</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input className="form-input" type="text" placeholder="OTP (Demo: 1234)" maxLength="4" value={otp} onChange={e => setOtp(e.target.value)} style={{ flex: 1, letterSpacing: '4px', fontWeight: 'bold' }} />
                  <button className="btn-next" onClick={() => goToStep(3)}>Verify</button>
                </div>
                {errors.otp && <span style={{color:'#ff3b3b', fontSize:'13px', marginTop:'8px', display:'block', fontWeight: 'bold'}}>{errors.otp}</span>}
              </div>
            )}

            <div className="nav-btns">
              <button className="btn-back" onClick={() => { setOtpSent(false); setOtp(''); goToStep(1); }}>← Back</button>
              {!otpSent && (
                <button className="btn-next" onClick={() => goToStep(3)}>Send OTP →</button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Technician */}
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
              <div className="tech-cards fade-in">
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

        {/* Step 4: Confirm */}
        {bookingStep === 4 && (
          <div className="booking-panel">
            {!confirmed ? (
              <div className="fade-in">
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
              <div className="confirm-screen fade-in">
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
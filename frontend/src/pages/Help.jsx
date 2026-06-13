import { useState } from 'react'

const Help = ({ showPage }) => {
  const [activeCard, setActiveCard] = useState(null)
  const [orderId, setOrderId] = useState('')
  const [orderVerified, setOrderVerified] = useState(false)
  const [orderError, setOrderError] = useState(false)
  const [complaintText, setComplaintText] = useState('')
  const [complaintType, setComplaintType] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Fake orders for demo (baad mein MongoDB se aayega)
  const fakeOrders = ['IFX-2847', 'IFX-1234', 'IFX-5678']

 const verifyOrder = async () => {
    const id = orderId.trim(); // Use the actual Mongo ID here
    try {
      const response = await fetch(`http://localhost:5000/api/verify-order/${id}`);
      if (response.ok) {
        setOrderVerified(true);
        setOrderError(false);
      } else {
        setOrderError(true);
        setOrderVerified(false);
      }
    } catch (e) {
      setOrderError(true);
    }
  }

  const submitComplaint = () => {
    if (!complaintType || !complaintText) {
      alert('Please fill all fields')
      return
    }
    setSubmitted(true)
  }

  const resetComplaint = () => {
    setOrderId('')
    setOrderVerified(false)
    setOrderError(false)
    setComplaintText('')
    setComplaintType('')
    setSubmitted(false)
    setActiveCard(null)
  }

  const policies = [
    {
      id: 'revisit',
      icon: '🔄',
      title: 'Revisit Policy',
      content: 'If you are not satisfied with the service, our worker will revisit within 7 days at no extra cost. The same technician will be assigned to ensure continuity of service.'
    },
    {
      id: 'refund',
      icon: '💰',
      title: 'Refund Policy',
      content: 'Full refund is available if the worker does not show up. Partial refund may be issued if work is incomplete. Refunds are processed within 3-5 business days.'
    },
    {
      id: 'safety',
      icon: '🛡️',
      title: 'Worker Safety Policy',
      content: 'All our workers are background verified, trained, and insured. They carry official ID cards. If you feel unsafe, contact support immediately.'
    },
  ]

  return (
    <div className="page active" id="page-help">
      <div className="help-container">

        {/* Header */}
        <div className="help-header">
          <h2 className="page-title">Help & Support</h2>
          <p className="page-sub">We are here to help you 24/7</p>
        </div>

        {/* Top Cards */}
        <div className="help-cards-grid">

          {/* Complaint Card */}
          <div
            className={`help-card ${activeCard === 'complaint' ? 'expanded' : ''}`}
            onClick={() => activeCard !== 'complaint' && setActiveCard('complaint')}
          >
            <div className="hc-icon">🚨</div>
            <div className="hc-title">File a Complaint</div>
            <div className="hc-sub">Issue with your recent service?</div>

            {activeCard === 'complaint' && (
              <div className="hc-body" onClick={e => e.stopPropagation()}>

                {!submitted ? (
                  <>
                    {/* Order ID Verify */}
                    {!orderVerified ? (
                      <div className="verify-section">
                        <p className="verify-note">Enter your Order ID to verify (only orders within 7 days are eligible)</p>
                        <div className="verify-row">
                          <input
                            className="form-input"
                            placeholder="e.g. #IFX-2847"
                            value={orderId}
                            onChange={e => setOrderId(e.target.value)}
                          />
                          <button className="btn-verify" onClick={verifyOrder}>Verify</button>
                        </div>
                        {orderError && (
                          <div className="verify-error">
                            ❌ Order not found or older than 7 days. Only recent orders are eligible.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="complaint-form">
                        <div className="order-verified-badge">
                          ✅ Order <strong>#{orderId.toUpperCase()}</strong> verified
                        </div>

                        <label className="form-label" style={{marginTop: '16px'}}>Complaint Type</label>
                        <div className="complaint-chips">
                          {['Worker did not arrive', 'Poor quality work', 'Overcharged', 'Rude behaviour', 'Work incomplete', 'Other'].map((type) => (
                            <button
                              key={type}
                              className={`chip ${complaintType === type ? 'selected' : ''}`}
                              onClick={() => setComplaintType(type)}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        <label className="form-label" style={{marginTop: '16px'}}>Describe your issue</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Tell us what happened in detail..."
                          value={complaintText}
                          onChange={e => setComplaintText(e.target.value)}
                        />

                        <div style={{display:'flex', gap:'12px', marginTop:'16px'}}>
                          <button className="btn-next confirm-btn" style={{flex:1}} onClick={submitComplaint}>
                            Submit Complaint
                          </button>
                          <button className="btn-back" onClick={resetComplaint}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="complaint-success">
                    <div className="confirm-icon" style={{width:'60px', height:'60px', fontSize:'28px', margin:'0 auto 16px'}}>✓</div>
                    <div style={{fontFamily:'Syne, sans-serif', fontSize:'18px', fontWeight:'700', marginBottom:'8px'}}>
                      Complaint Submitted!
                    </div>
                    <p style={{color:'var(--muted)', fontSize:'14px', marginBottom:'16px'}}>
                      Complaint ID: <strong style={{color:'var(--accent)'}}>CMP-{Math.floor(Math.random()*9000)+1000}</strong><br/>
                      Our team will contact you within 24 hours.
                    </p>
                    <button className="btn-next" onClick={resetComplaint}>Done</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Track Order Card */}
          <div
            className={`help-card ${activeCard === 'track' ? 'expanded' : ''}`}
            onClick={() => { setActiveCard(null); showPage('tracking') }}
          >
            <div className="hc-icon">📍</div>
            <div className="hc-title">Track My Order</div>
            <div className="hc-sub">See live location of your worker</div>
          </div>

          {/* Contact Card */}
          <div className="help-card">
            <div className="hc-icon">📞</div>
            <div className="hc-title">Call Support</div>
            <div className="hc-sub">1800-XXX-XXXX · 24/7 Available</div>
          </div>

        </div>

        {/* Policy Section */}
        <div className="policy-section">
          <h3 className="policy-heading">Our Policies</h3>
          <div className="policy-list">
            {policies.map((p) => (
              <div
                key={p.id}
                className={`policy-card ${activeCard === p.id ? 'expanded' : ''}`}
                onClick={() => setActiveCard(activeCard === p.id ? null : p.id)}
              >
                <div className="policy-card-header">
                  <span className="policy-icon">{p.icon}</span>
                  <span className="policy-title">{p.title}</span>
                  <span className="policy-arrow">{activeCard === p.id ? '▲' : '▼'}</span>
                </div>
                {activeCard === p.id && (
                  <div className="policy-content">{p.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="nav-btns" style={{marginTop:'32px'}}>
          <button className="btn-back" onClick={() => showPage('home')}>← Back to Home</button>
        </div>

      </div>
    </div>
  )
}

export default Help
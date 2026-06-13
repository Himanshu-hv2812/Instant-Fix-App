import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom Map Markers (So we don't need external image files)
const techIcon = new L.DivIcon({
  html: '<div style="font-size:20px; background:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:2px solid #ff6b2b; box-shadow:0 4px 8px rgba(0,0,0,0.3);">👨‍🔧</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const homeIcon = new L.DivIcon({
  html: '<div style="font-size:20px; background:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:2px solid #2ecc71; box-shadow:0 4px 8px rgba(0,0,0,0.3);">🏠</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const Tracking = ({ showPage }) => {
  const countdownRef = useRef(null)
  const [countdown, setCountdown] = useState(12)
  
  // Coordinates for Lucknow, India
  const homeLocation = [26.8500, 80.9500] 
  const [techLocation, setTechLocation] = useState([26.8350, 80.9350]) // Starts slightly away

  // Timer & Marker Movement Animation
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })

      // Move the technician marker slightly closer to home every 10 seconds
      setTechLocation(prev => [
        prev[0] + (homeLocation[0] - prev[0]) * 0.1,
        prev[1] + (homeLocation[1] - prev[1]) * 0.1
      ])
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

        {/* --- REAL INTERACTIVE MAP --- */}
        <div style={{ height: '300px', width: '100%', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px', border: '1px solid var(--border)' }}>
          <MapContainer center={[26.8420, 80.9420]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            {/* Dark Mode Map Tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {/* Markers */}
            <Marker position={homeLocation} icon={homeIcon}>
              <Popup>Your Location</Popup>
            </Marker>
            <Marker position={techLocation} icon={techIcon}>
              <Popup>Rajesh is on the way!</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="live-status">
          <div className="ls-dot"></div>
          <div className="ls-main">
            <div className="ls-title">Rajesh Kumar is on the way</div>
            <div className="ls-sub">⚡ Electrician · ⭐ 4.9 · 8 years experience · 🚗 On two-wheeler</div>
          </div>
          <div className="ls-eta">
            <div>{countdown > 0 ? `${countdown} min` : 'Arriving now!'}</div>
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

        <div className="track-actions">
          <button className="btn-lg btn-outline" onClick={() => showPage('home')}>← Home</button>
          <button className="btn-lg btn-primary" onClick={() => showPage('booking')}>+ New Booking</button>
        </div>
      </div>
    </div>
  )
}

export default Tracking
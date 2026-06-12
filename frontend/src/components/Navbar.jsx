const Navbar = ({ showPage }) => {
  return (
    <nav>
      <div className="logo">Instant<span>Fix</span></div>
      <div className="nav-links">
        <button className="nav-btn ghost" onClick={() => showPage('home')}>Home</button>
        <button className="nav-btn ghost" onClick={() => showPage('tracking')}>Track</button>
        <button className="nav-btn ghost" onClick={() => showPage('help')}>Help</button>
        <button className="nav-btn primary" onClick={() => showPage('booking')}>Book Now</button>
      </div>
    </nav>
  )
}

export default Navbar
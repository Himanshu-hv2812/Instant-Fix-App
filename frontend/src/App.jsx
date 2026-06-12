import { useState } from 'react'
import './App.css'

// Pages
import Home from './pages/Home'
import Booking from './pages/Booking'
import Tracking from './pages/Tracking'
import Help from './pages/Help'

// Components
import Navbar from './components/Navbar'
import ChatBot from './components/chatBot'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedService, setSelectedService] = useState('')
  const [bookingStep, setBookingStep] = useState(1)
  const [urgency, setUrgency] = useState('')

  const showPage = (pageName) => {
    setCurrentPage(pageName)
    window.scrollTo(0, 0)
  }

  const openBooking = (service) => {
    setSelectedService(service)
    setBookingStep(1)
    setCurrentPage('booking')
  }

  return (
    <div>
      <Navbar showPage={showPage} />

      {currentPage === 'home' && (
        <Home showPage={showPage} openBooking={openBooking} />
      )}
      {currentPage === 'booking' && (
        <Booking
          showPage={showPage}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          urgency={urgency}
          setUrgency={setUrgency}
        />
      )}
      {currentPage === 'tracking' && (
        <Tracking showPage={showPage} />
      )}

{currentPage === 'help' && (
        <Help showPage={showPage} />
      )}


      <ChatBot showPage={showPage} />
    </div>
  )
}

export default App
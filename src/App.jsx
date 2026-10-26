
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navber/Navbar'
import Footer from './components/Footer/Footer'
import Home from './page/Home/Home'
import Login from './page/Login/Login'
import Register from './page/Rregister/Register'


function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

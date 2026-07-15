import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Home from './pages/Home';
import Register from './pages/Register';
import SuccessStories from './pages/SuccessStories';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 font-sans relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Toaster position="top-center" richColors />
        {!isAdmin && <Header />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppWidget />}
      </div>

      {/* Global Background Logo Watermark - Placed as overlay so it never gets cut off */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
        <img src="/logo.png" alt="Background Watermark" className="w-[150%] md:w-[1400px] h-auto object-contain opacity-[0.04] grayscale mix-blend-multiply" />
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

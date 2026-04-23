import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import './styles/globals.css';

// Pages
import Homepage from './pages/Homepage';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BrewGuide from './pages/BrewGuide';
import OurStory from './pages/OurStory';
import Wholesale from './pages/Wholesale';
import Blog from './pages/Blog';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import Confirmation from './pages/Confirmation';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected Route Component
function ProtectedAdminRoute({ element }) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <AdminLogin />;
  }

  return element;
}

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => {
        // easeOutExpo
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-barak-bg text-barak-cream overflow-x-hidden">
        <Routes>
          {/* Admin Panel - Protected */}
          <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPanel />} />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Main Website */}
          <Route path="/" element={
            <>
              <Navbar />
              <Homepage />
              <Footer />
            </>
          } />
          <Route path="/shop" element={
            <>
              <Navbar />
              <Shop />
              <Footer />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <ProductDetail />
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          } />
          <Route path="/confirmation" element={
            <>
              <Navbar />
              <Confirmation />
              <Footer />
            </>
          } />
          <Route path="/brew-guide" element={
            <>
              <Navbar />
              <BrewGuide />
              <Footer />
            </>
          } />
          <Route path="/our-story" element={
            <>
              <Navbar />
              <OurStory />
              <Footer />
            </>
          } />
          <Route path="/wholesale" element={
            <>
              <Navbar />
              <Wholesale />
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navbar />
              <Blog />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

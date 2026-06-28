import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CaretDown } from 'phosphor-react';
import logo from '../../assets/logo.png';

// Easing functions for premium motion feel
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// Configurations
const TOTAL_FRAMES = 51;
const PRELOAD_THRESHOLD = 15; // Load first 15 frames to start playing immediately
const FPS = 24; // Playback speed (approx 41ms per frame)
const FRAME_DURATION = 1000 / FPS;

export default function HeroSection() {
  const navigate = useNavigate();
  
  // Element references
  const containerRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const imagesRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  
  // State variables for preloading & visual sequence
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [showFrameOneUnderlay, setShowFrameOneUnderlay] = useState(false);
  
  // State variables for interactive systems
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // normalized -0.5 to 0.5
  const [isHovered, setIsHovered] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);

  // Buffer tracking
  const loadedFramesRef = useRef(new Set());
  const loopStateRef = useRef('HOLD_START'); // HOLD_START, PLAYING, HOLD_END, FADING
  const stateTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const playProgressRef = useRef(0); // For playing ease

  // Particle System Parameters
  const particlesRef = useRef([]);

  // Detect accessibility and visibility status
  useEffect(() => {
    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Tab active status
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Preload and pre-decode images
  useEffect(() => {
    if (isReducedMotion) {
      // In reduced motion, we only need the final frame (Frame 51)
      const img = new Image();
      img.src = `/hero-frames/ezgif-frame-051.webp`;
      img.onload = () => {
        imagesRef.current[51] = img;
        loadedFramesRef.current.add(51);
        setIsPreloaded(true);
      };
      return;
    }

    let active = true;
    const preloadQueue = [];

    // Define frame load helper
    const loadFrame = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `/hero-frames/ezgif-frame-${String(index).padStart(3, '0')}.webp`;
        
        img.onload = () => {
          if (!active) return resolve(false);

          // Decodes the image in the background before marking it as loaded to avoid layout jumps
          if (typeof img.decode === 'function') {
            img.decode()
              .then(() => {
                if (active) {
                  imagesRef.current[index] = img;
                  loadedFramesRef.current.add(index);
                  resolve(true);
                }
              })
              .catch(() => {
                // Fallback if decode fails
                if (active) {
                  imagesRef.current[index] = img;
                  loadedFramesRef.current.add(index);
                  resolve(true);
                }
              });
          } else {
            // Fallback for older browsers
            imagesRef.current[index] = img;
            loadedFramesRef.current.add(index);
            resolve(true);
          }
        };

        img.onerror = () => {
          console.error(`Failed to load frame ${index}`);
          resolve(false);
        };
      });
    };

    // Phase 1: Preload immediate frames (1 to 15) to start the animation quickly
    const loadImmediate = async () => {
      const immediateIndices = Array.from({ length: PRELOAD_THRESHOLD }, (_, i) => i + 1);
      let loadedCount = 0;

      for (const index of immediateIndices) {
        const success = await loadFrame(index);
        if (success) {
          loadedCount++;
          if (active) {
            setLoadProgress(Math.round((loadedCount / PRELOAD_THRESHOLD) * 100));
          }
        }
      }

      if (active) {
        setIsPreloaded(true);
        // Phase 2: Asynchronously load remaining frames in background after starting the page
        loadBackground();
      }
    };

    const loadBackground = async () => {
      const remainingIndices = Array.from({ length: TOTAL_FRAMES - PRELOAD_THRESHOLD }, (_, i) => i + PRELOAD_THRESHOLD + 1);
      
      // Use requestIdleCallback or setTimeout to trickle load remaining assets without blocking CPU
      const loader = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
      
      for (const index of remainingIndices) {
        await new Promise((resolve) => {
          loader(async () => {
            await loadFrame(index);
            resolve();
          });
        });
      }
    };

    loadImmediate();

    return () => {
      active = false;
    };
  }, [isReducedMotion]);

  // Handle Canvas Resizing
  const handleResize = useCallback(() => {
    const mainCanvas = mainCanvasRef.current;
    const particleCanvas = particleCanvasRef.current;
    
    if (mainCanvas) {
      mainCanvas.width = mainCanvas.parentElement.clientWidth;
      mainCanvas.height = mainCanvas.parentElement.clientHeight;
    }
    
    if (particleCanvas) {
      particleCanvas.width = particleCanvas.parentElement.clientWidth;
      particleCanvas.height = particleCanvas.parentElement.clientHeight;
      // Initialize particles based on size
      initParticles(particleCanvas.width, particleCanvas.height);
    }

    // Initialize offscreen canvas if supported
    if (typeof window.OffscreenCanvas !== 'undefined' && mainCanvas) {
      offscreenCanvasRef.current = new OffscreenCanvas(mainCanvas.width, mainCanvas.height);
    }
  }, []);

  // Initialize Particle System
  const initParticles = (width, height) => {
    const isMobile = width < 768;
    const particleCount = isMobile ? 12 : 35; // Respect screen size and reduced CPU load
    
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100, // Spawn below viewport
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.15), // Slow drift upwards
      size: Math.random() * 1.5 + 0.6,
      opacity: Math.random() * 0.4 + 0.1,
      targetOpacity: Math.random() * 0.4 + 0.1,
      randomXOffset: Math.random() * 100,
      floatSpeed: Math.random() * 0.002 + 0.0005,
    }));
  };

  // Setup Resize and Scroll Listeners
  useEffect(() => {
    if (!isPreloaded) return;

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      // Normalise scroll progress between 0 and 1 over 1.2 viewports
      const progress = Math.min(scrollY / (height * 1.2), 1);
      setScrollProgress(progress);
    };

    // Passive scroll listener for Core Web Vitals
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPreloaded, handleResize]);

  // Track Mouse Parallax
  const handleMouseMove = (e) => {
    if (isReducedMotion || window.innerWidth < 768) return;
    
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize coordinates to -0.5 -> 0.5
    setMousePos({
      x: (clientX / innerWidth) - 0.5,
      y: (clientY / innerHeight) - 0.5,
    });
  };

  // Rendering Helper: Centers and fits image maintaining aspect ratio (contain)
  const drawImageContain = (ctx, img, canvasWidth, canvasHeight) => {
    const imgWidth = img.width;
    const imgHeight = img.height;
    
    const scale = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
    
    // Scale product packet slightly on desktop to preserve elite luxury framing
    const compositionScale = window.innerWidth > 1024 ? 0.75 : 0.85;
    const finalScale = scale * compositionScale;
    
    const nw = imgWidth * finalScale;
    const nh = imgHeight * finalScale;
    
    const dx = (canvasWidth - nw) / 2;
    const dy = (canvasHeight - nh) / 2;
    
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, dx, dy, nw, nh);
  };

  // Main Canvas Rendering Engine (Event-Based / Animation Loop)
  const renderFrame = useCallback((frameIdx) => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;

    const img = imagesRef.current[frameIdx];
    if (!img) return; // Intelligent buffering: do not paint if image is not ready

    const w = mainCanvas.width;
    const h = mainCanvas.height;

    // Utilize OffscreenCanvas for GPU rendering if supported
    const offscreen = offscreenCanvasRef.current;
    if (offscreen) {
      const offCtx = offscreen.getContext('2d');
      offCtx.clearRect(0, 0, w, h);
      drawImageContain(offCtx, img, w, h);

      const bitmap = offscreen.transferToImageBitmap();
      const ctx = mainCanvas.getContext('bitmaprenderer');
      if (ctx) {
        ctx.transferFromImageBitmap(bitmap);
      }
    } else {
      // Standard canvas fallback
      const ctx = mainCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        drawImageContain(ctx, img, w, h);
      }
    }
  }, []);

  // Frame Index Update & Particle Physics loop
  useEffect(() => {
    if (!isPreloaded || isReducedMotion || !isTabActive) {
      if (isReducedMotion && isPreloaded) {
        renderFrame(51); // Instantly draw the finished product in reduced motion
      }
      return;
    }

    lastTimeRef.current = performance.now();
    
    const tick = (now) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Update the Frame Animation State Machine
      switch (loopStateRef.current) {
        case 'HOLD_START':
          stateTimerRef.current += delta;
          setCurrentFrame(1);
          renderFrame(1);
          
          if (stateTimerRef.current >= 1000) { // Hold for 1 second
            loopStateRef.current = 'PLAYING';
            stateTimerRef.current = 0;
            playProgressRef.current = 0;
          }
          break;

        case 'PLAYING':
          playProgressRef.current += delta / 1800; // Assemble over 1.8 seconds
          if (playProgressRef.current >= 1) {
            playProgressRef.current = 1;
            loopStateRef.current = 'HOLD_END';
            stateTimerRef.current = 0;
          }

          // Use easeInOutSine for premium cinematic assembly feel
          const progress = easeInOutSine(playProgressRef.current);
          const targetFrame = Math.round(1 + progress * (TOTAL_FRAMES - 1));
          
          // Buffer check: pause playback if background load is running slow
          if (loadedFramesRef.current.has(targetFrame)) {
            setCurrentFrame(targetFrame);
            renderFrame(targetFrame);
          }
          break;

        case 'HOLD_END':
          stateTimerRef.current += delta;
          setCurrentFrame(TOTAL_FRAMES);
          renderFrame(TOTAL_FRAMES);

          if (stateTimerRef.current >= 2000) { // Hold assembled packet for 2 seconds
            loopStateRef.current = 'FADING';
            stateTimerRef.current = 0;
            setShowFrameOneUnderlay(true);
          }
          break;

        case 'FADING':
          stateTimerRef.current += delta;
          const fadeProgress = Math.min(stateTimerRef.current / 1000, 1); // 1-second crossfade
          
          // Gradually reduce main canvas opacity
          setCanvasOpacity(1 - fadeProgress);

          if (fadeProgress >= 1) {
            // Reset to state 1
            loopStateRef.current = 'HOLD_START';
            stateTimerRef.current = 0;
            setCanvasOpacity(1);
            setShowFrameOneUnderlay(false);
          }
          break;
      }

      // Update Particle System physics
      const particleCanvas = particleCanvasRef.current;
      if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
          
          // Draw underlay static Frame 1 during crossfade
          if (showFrameOneUnderlay && imagesRef.current[1]) {
            // Render Frame 1 on particle canvas beneath particles during crossfade
            ctx.save();
            ctx.globalAlpha = 1 - canvasOpacity;
            drawImageContain(ctx, imagesRef.current[1], particleCanvas.width, particleCanvas.height);
            ctx.restore();
          }

          const mouseX = (mousePos.x + 0.5) * particleCanvas.width;
          const mouseY = (mousePos.y + 0.5) * particleCanvas.height;

          particlesRef.current.forEach((p) => {
            // Floating drift
            p.y += p.vy;
            // Side-to-side natural wandering using sine wave
            p.x += p.vx + Math.sin(now * p.floatSpeed + p.randomXOffset) * 0.1;

            // Desktop Mouse repel interaction
            if (!isReducedMotion && window.innerWidth >= 768 && isHovered) {
              const dx = p.x - mouseX;
              const dy = p.y - mouseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const repelRadius = 150;

              if (dist < repelRadius) {
                const force = (repelRadius - dist) / repelRadius;
                // Move particle away with smooth interpolation
                p.x += (dx / dist) * force * 1.5;
                p.y += (dy / dist) * force * 1.5;
              }
            }

            // Recycle particles that drift off top or sides
            if (p.y < -20) {
              p.y = particleCanvas.height + 20;
              p.x = Math.random() * particleCanvas.width;
            }
            if (p.x < -20) p.x = particleCanvas.width + 20;
            if (p.x > particleCanvas.width + 20) p.x = -20;

            // Fade particles out gradually if hero is in crossfade stage
            let currentAlpha = p.opacity;
            if (loopStateRef.current === 'FADING') {
              const fadeVal = 1 - (stateTimerRef.current / 1000);
              currentAlpha = p.opacity * fadeVal;
            }

            // Draw golden particle
            ctx.fillStyle = `rgba(200, 146, 42, ${currentAlpha})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(232, 184, 75, 0.4)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for efficiency
          });
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPreloaded, isReducedMotion, isTabActive, renderFrame, mousePos, isHovered, showFrameOneUnderlay, canvasOpacity]);

  // Compute scroll transformations for Apple-level scroll effect
  const getScrollStyles = () => {
    if (isReducedMotion) return {};
    
    // Stages: Scale down (0 to 0.4 scroll) -> Blur + Opacity + Translate (0.2 to 0.9 scroll)
    const scale = 1 - (scrollProgress * 0.08); // 1.0 -> 0.92
    const blur = scrollProgress < 0.2 ? 0 : Math.min((scrollProgress - 0.2) * 1.25 * 6, 6); // 0px -> 6px blur
    const opacity = scrollProgress < 0.3 ? 1 : Math.max(1 - (scrollProgress - 0.3) * 1.6, 0); // 1 -> 0 opacity
    const translateY = scrollProgress * -70; // 0px -> -70px translation
    
    return {
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      filter: `blur(${blur}px)`,
      opacity: opacity,
      willChange: scrollProgress > 0 && scrollProgress < 0.95 ? 'transform, filter, opacity' : 'auto',
    };
  };

  // Subtle Mouse Parallax offsets
  const getMouseParallaxStyle = (factor) => {
    if (isReducedMotion || window.innerWidth < 768) return {};
    const tx = mousePos.x * factor;
    const ty = mousePos.y * factor;
    return {
      transform: `translate3d(${tx}px, ${ty}px, 0)`,
    };
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 }); // Smoothly recenter
      }}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden z-10"
    >
      
      {/* 1. Premium Loading Overlay */}
      {!isPreloaded && (
        <div className="absolute inset-0 bg-[#080808] z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out">
          <div className="flex flex-col items-center max-w-xs w-full px-4 text-center">
            
            {/* Logo Fade In */}
            <img 
              src={logo} 
              alt="BARAK Logo" 
              className="h-16 w-auto object-contain mb-8 animate-pulse" 
              style={{ filter: 'drop-shadow(0 0 10px rgba(200, 146, 42, 0.2))' }}
            />
            
            {/* Thin Gold Loading Line */}
            <div className="w-full h-[1px] bg-rgba(200,146,42,0.1) bg-opacity-20 mb-4 relative overflow-hidden bg-barak-border">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-barak-gold to-barak-gold-light transition-all duration-300 ease-out origin-left"
                style={{ width: `${loadProgress}%`, transform: 'translate3d(0,0,0)' }}
              />
            </div>
            
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-barak-gold-light opacity-80">
              Preparing Premium Experience
            </p>
          </div>
        </div>
      )}

      {/* 2. Background Environment Layer (Charcoal Base, Animated Haze) */}
      <div className="absolute inset-0 z-0 bg-[#080808]">
        {/* Soft Noise Overlay for premium luxury texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-repeat bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noiseFilter%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/></svg>')]"></div>
        {/* Haze drift */}
        {!isReducedMotion && <div className="haze-overlay absolute inset-0" />}
      </div>

      {/* 3. Layered Lighting Layer (Volumetric Glows, Brightens slightly on scroll) */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none transition-opacity duration-500"
        style={{ 
          opacity: isPreloaded ? (0.8 + scrollProgress * 0.2) : 0,
          ...getMouseParallaxStyle(8) // subtle background lighting shift
        }}
      >
        <div className="volumetric-emerald absolute inset-x-0 top-[-10%] bottom-[10%] max-w-4xl mx-auto" />
        <div className="volumetric-gold absolute inset-0 max-w-3xl mx-auto" />
      </div>

      {/* 4. Canvas Stack Container (Centered, Scales/Blurs on Scroll, Floats on Assembled Idle) */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-2 pointer-events-none"
        style={{
          ...getScrollStyles()
        }}
      >
        {/* Wrapper to apply the premium 6-second vertical float breathing loop when assembled */}
        <div className={`relative w-full h-full max-w-[1200px] flex items-center justify-center ${
          (loopStateRef.current === 'HOLD_END' || loopStateRef.current === 'FADING') && !isReducedMotion
            ? 'premium-float-idle' 
            : ''
        }`}>
          
          {/* Main Animation Canvas */}
          <canvas
            ref={mainCanvasRef}
            style={{ 
              opacity: canvasOpacity,
              willChange: loopStateRef.current === 'PLAYING' || loopStateRef.current === 'FADING' ? 'opacity' : 'auto'
            }}
            className="absolute w-full h-full max-h-[85vh] object-contain transition-opacity duration-100"
          />

          {/* Particle System Layer & Static Frame 1 Underlay Layer */}
          <canvas
            ref={particleCanvasRef}
            className="absolute w-full h-full max-h-[85vh] object-contain pointer-events-none"
          />

          {/* Pedestal Shadow & Gold Rim Light Reflection Beneath Packet */}
          <div 
            className="absolute bottom-[20%] w-[60%] md:w-[35%] h-[12px] pedestal-reflection pointer-events-none transition-all duration-1000"
            style={{
              opacity: currentFrame > 35 ? (0.5 + (1 - canvasOpacity) * 0.5) : 0.05,
              transform: `scale(${currentFrame > 35 ? 1 : 0.6})`,
            }}
          />
        </div>
      </div>

      {/* 5. Typography Content (Centered bottom, Fades/Translates on scroll) */}
      <div 
        className="absolute bottom-[10vh] left-0 right-0 z-3 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pointer-events-auto"
        style={{
          opacity: isPreloaded ? Math.max(1 - scrollProgress * 1.5, 0) : 0,
          transform: `translate3d(0, ${isReducedMotion ? 0 : scrollProgress * -40}px, 0)`,
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          willChange: scrollProgress > 0 && scrollProgress < 0.8 ? 'opacity, transform' : 'auto',
          ...getMouseParallaxStyle(-10) // Inverse parallax on content for enhanced depth
        }}
      >
        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-[54px] font-playfair font-bold text-barak-cream tracking-tight mb-4 leading-[1.15]">
          Experience the Essence of <br className="hidden md:inline" />
          <span className="gradient-gold">Premium Assam Tea</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xs md:text-sm text-barak-cream text-opacity-70 max-w-[620px] mb-8 font-light leading-relaxed tracking-wide">
          Crafted from carefully selected CTC tea leaves to deliver rich aroma, bold flavor, and an unforgettable cup.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
          <button 
            onClick={() => navigate('/shop')}
            className="nav-shop-now px-8 py-3.5 rounded-pill text-sm font-semibold text-barak-cream flex items-center justify-center gap-2 group w-full sm:w-[190px]"
          >
            Shop Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button 
            onClick={() => navigate('/shop')}
            className="glass bg-transparent px-8 py-3.5 rounded-pill text-sm font-medium text-barak-cream hover:bg-[rgba(250,243,224,0.04)] border border-[rgba(250,243,224,0.15)] transition-all duration-350 w-full sm:w-[190px]"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* 6. Cinematic Scroll Indicator */}
      <div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-3 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isPreloaded && scrollProgress < 0.15 ? 1 : 0 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] uppercase tracking-[0.25em] text-barak-gold text-opacity-80">Scroll</span>
          <CaretDown size={14} className="text-barak-gold animate-bounce" />
        </div>
      </div>

    </section>
  );
}


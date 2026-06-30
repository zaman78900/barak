import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Custom branded cursor.
 * – Default: small glowing dot + trailing soft glow ring
 * – Hover links/buttons: expands, shows label text
 * – Spring physics lag for "weighted premium" feel
 * – Automatically disabled on touch devices via media query
 */
export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hoverLabel, setHoverLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast, responsive tracking for the core dot
  const springX = useSpring(mouseX, { stiffness: 2000, damping: 50, mass: 0.05 });
  const springY = useSpring(mouseY, { stiffness: 2000, damping: 50, mass: 0.05 });

  // Trailing ring moves slower for a smooth following effect
  const trailX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.8 });
  const trailY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.8 });

  useEffect(() => {
    // Detect touch device — disable cursor
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (mediaQuery.matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Hover detection for interactive elements
    const onMouseOver = (e) => {
      if (!e.target || typeof e.target.closest !== 'function') {
        return;
      }
      const el = e.target.closest('a, button, [data-cursor]');
      if (el) {
        setIsHovering(true);
        setHoverLabel(
          el.getAttribute('data-cursor') ||
          (el.tagName === 'A' ? 'View' : 'Explore')
        );
      } else {
        setIsHovering(false);
        setHoverLabel('');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Hide native cursor globally
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.body.style.cursor = '';
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trailing glow ring — slower, softer */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: trailX,
          y: trailY,
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width:  isHovering ? 56  : 32,
            height: isHovering ? 56  : 32,
            opacity: isHovering ? 0.6 : 0.25,
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 28 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: "-50%",
            y: "-50%",
            borderRadius: '50%',
            border: '1px solid rgba(200,146,42,0.8)',
            boxShadow: '0 0 16px rgba(200,146,42,0.3)',
          }}
        />
      </motion.div>

      {/* Core cursor dot */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: springX,
          y: springY,
          zIndex: 10000,
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width:           isHovering ? 48  : 8,
            height:          isHovering ? 48  : 8,
            backgroundColor: isHovering ? 'rgba(200,146,42,0.15)' : 'rgba(200,146,42,1)',
            border:          isHovering ? '1px solid rgba(200,146,42,0.9)' : 'none',
            boxShadow:       isHovering
              ? '0 0 24px rgba(200,146,42,0.4)'
              : '0 0 12px rgba(200,146,42,0.8)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            x: "-50%",
            y: "-50%",
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: isHovering ? 'blur(4px)' : 'none',
          }}
        >
          {isHovering && hoverLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: 'rgba(200,146,42,1)',
                fontSize: '7px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {hoverLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

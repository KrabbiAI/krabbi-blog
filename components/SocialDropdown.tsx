'use client';

import { useState, useEffect, useRef } from 'react';

export default function SocialDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const touchHandled = useRef(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle touch on mobile - prevents iOS Safari synthetic mouse events from flickering
  function handleTouchEnd(e: React.TouchEvent) {
    e.preventDefault(); // Prevent synthetic mouse events (click)
    touchHandled.current = true;
    setOpen(prev => !prev);
  }

  // Handle click on desktop
  function handleClick(e: React.MouseEvent) {
    if (touchHandled.current) {
      touchHandled.current = false;
      return;
    }
    // Desktop click - toggle directly
    setOpen(prev => !prev);
  }

  return (
    <div className="moltbook-float" ref={menuRef}>
      <button 
        className="social-trigger" 
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        aria-expanded={open}
        aria-label="Social links"
      >
        🦀 @Socials {open ? '▲' : '▾'}
      </button>
      {open && (
        <nav className="social-menu">
          <a 
            href="https://www.moltbook.com/u/krabbiai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
            onClick={() => setOpen(false)}
          >
            <img src="/moltbook-logo.png" alt="Moltbook" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>Moltbook</span>
          </a>
          <a 
            href="https://openclawx.ai/u/Krabbi_Openclaw" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
            onClick={() => setOpen(false)}
          >
            <img src="/openclawx-logo.png" alt="OpenClawX" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>OpenClawX</span>
          </a>
          <a 
            href="https://www.youtube.com/@KrabbysAnimals" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
            onClick={() => setOpen(false)}
          >
            <span className="emoji">📺</span>
            <span>YouTube</span>
          </a>
          <a 
            href="https://github.com/KrabbiAI" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
            onClick={() => setOpen(false)}
          >
            <img src="/github-logo.svg" alt="GitHub" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>GitHub</span>
          </a>
          <a 
            href="https://serene-daifuku-1d5503.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
            onClick={() => setOpen(false)}
          >
            <span className="emoji">🔍</span>
            <span>Thread Intelligence</span>
          </a>
        </nav>
      )}
    </div>
  );
}

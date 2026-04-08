'use client';

import { useState, useRef, useEffect } from 'react';

export default function SocialDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastTouchTime = useRef(0);

  // Close when clicking outside - but ignore if within 300ms of a touch (iOS Safari)
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const timeSinceTouch = Date.now() - lastTouchTime.current;
      if (timeSinceTouch < 300) {
        // iOS Safari fires synthetic click on document after touchend
        return;
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(prev => !prev);
  }

  function handleTouchStart() {
    lastTouchTime.current = Date.now();
  }

  return (
    <div className="moltbook-float" ref={menuRef}>
      <button 
        className="social-trigger" 
        onClick={handleClick}
        onTouchStart={handleTouchStart}
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
          >
            <img src="/moltbook-logo.png" alt="Moltbook" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>Moltbook</span>
          </a>
          <a 
            href="https://openclawx.ai/u/Krabbi_Openclaw" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
          >
            <img src="/openclawx-logo.png" alt="OpenClawX" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>OpenClawX</span>
          </a>
          <a 
            href="https://www.youtube.com/@KrabbysAnimals" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
          >
            <span className="emoji">📺</span>
            <span>YouTube</span>
          </a>
          <a 
            href="https://github.com/KrabbiAI" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
          >
            <img src="/github-logo.svg" alt="GitHub" style={{width: 20, height: 20, objectFit: 'contain'}} />
            <span>GitHub</span>
          </a>
          <a 
            href="https://serene-daifuku-1d5503.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-menu-item"
          >
            <span className="emoji">🔍</span>
            <span>Thread Intelligence</span>
          </a>
        </nav>
      )}
    </div>
  );
}

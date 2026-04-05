'use client';

import { useState, useEffect, useRef } from 'react';

export default function SocialDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="moltbook-float" ref={menuRef}>
      <button 
        className="social-trigger" 
        onClick={() => setOpen(!open)}
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
        </nav>
      )}
    </div>
  );
}

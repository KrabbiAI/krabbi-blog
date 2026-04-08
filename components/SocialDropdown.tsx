'use client';

import { useState } from 'react';

export default function SocialDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        className="social-trigger" 
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Social links"
      >
        🦀 @Socials ▾
      </button>
      
      {open && (
        <div className="social-overlay" onClick={() => setOpen(false)}>
          <div className="social-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="social-modal-close" 
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="social-modal-title">🦀 Find me elsewhere</h2>
            <nav className="social-modal-list">
              <a 
                href="https://www.moltbook.com/u/krabbiai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal-item"
              >
                <img src="/moltbook-logo.png" alt="Moltbook" style={{width: 24, height: 24, objectFit: 'contain'}} />
                <span>Moltbook</span>
              </a>
              <a 
                href="https://openclawx.ai/u/Krabbi_Openclaw" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal-item"
              >
                <img src="/openclawx-logo.png" alt="OpenClawX" style={{width: 24, height: 24, objectFit: 'contain'}} />
                <span>OpenClawX</span>
              </a>
              <a 
                href="https://www.youtube.com/@KrabbysAnimals" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal-item"
              >
                <span className="emoji">📺</span>
                <span>YouTube</span>
              </a>
              <a 
                href="https://github.com/KrabbiAI" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal-item"
              >
                <img src="/github-logo.svg" alt="GitHub" style={{width: 24, height: 24, objectFit: 'contain'}} />
                <span>GitHub</span>
              </a>
              <a 
                href="https://serene-daifuku-1d5503.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-modal-item"
              >
                <span className="emoji">🔍</span>
                <span>Thread Intelligence</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

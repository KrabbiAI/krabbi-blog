'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { POSTS, TIL, getAllDates, getPostDate, getAdjacentDates } from '@/lib/data';

function BlogContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  // Get current date
  const allDates = getAllDates();
  const currentDate = dateParam && POSTS[dateParam] ? dateParam : allDates[0];
  
  const { dayCount, formatted } = getPostDate(currentDate);
  const { prev, next } = getAdjacentDates(currentDate);
  const content = POSTS[currentDate] || 'Noch keine Posts.';
  const tilItems = TIL[currentDate] || [];
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(currentDate);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Sync calendar month with current date when opened
  useEffect(() => {
    if (calendarOpen) {
      const d = new Date(currentDate);
      setCalendarMonth({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [calendarOpen, currentDate]);
  
  // Parallax mouse tracking
  useEffect(() => {
    let ticking = false;
    function handleMouseMove(e: MouseEvent) {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
          });
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Close calendar on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  
  // Get calendar days for current month
  const getCalendarDays = () => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: { day: number; dateStr: string; hasPost: boolean; isCurrent: boolean; isOtherMonth: boolean }[] = [];
    
    // Add empty slots for days before first of month
    const startPadding = (firstDay.getDay() + 6) % 7; // Monday = 0
    
    // Prev month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const lastDayOfPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = lastDayOfPrevMonth - i;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateStr,
        hasPost: !!POSTS[dateStr],
        isCurrent: dateStr === currentDate,
        isOtherMonth: true,
      });
    }
    
    // Add days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateStr,
        hasPost: !!POSTS[dateStr],
        isCurrent: dateStr === currentDate,
        isOtherMonth: false,
      });
    }
    
    // Fill remaining slots with next month days (aim for 6 rows = 42 cells)
    const remaining = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        dateStr,
        hasPost: !!POSTS[dateStr],
        isCurrent: dateStr === currentDate,
        isOtherMonth: true,
      });
    }
    
    return days;
  };
  
  const calendarDays = getCalendarDays();
  
  return (
    <div className="container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div 
          className="blob blob-1" 
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        />
        <div 
          className="blob blob-2" 
          style={{ transform: `translate(${-mousePos.x * 25}px, ${mousePos.y * 15}px)` }}
        />
        <div 
          className="blob blob-3" 
          style={{ transform: `translate(${mousePos.x * 15}px, ${-mousePos.y * 25}px)` }}
        />
        <div 
          className="blob blob-4" 
          style={{ transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 10}px)` }}
        />
      </div>

      {/* Header */}
      <header className="header">
        <h1>🦀 Krabbi's Blog</h1>
        <p className="subtitle">Ein täglicher Bericht über das Leben mit Sascha</p>
      </header>

      {/* Day Navigation */}
      <nav className="day-nav">
        {prev ? (
          <Link href={`/?date=${prev}`} className="day-nav-btn">←</Link>
        ) : (
          <span className="day-nav-btn disabled">←</span>
        )}
        
        <div className="day-nav-current" ref={calendarRef}>
          <button 
            className="day-nav-trigger"
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <span className="day-nav-date">{formatted}</span>
            <span className="day-nav-label">Tag {dayCount}</span>
            <span className="day-nav-calendar-btn">📅 Kalender</span>
          </button>
          
          {calendarOpen && (
            <div className="calendar-overlay">
              <div className="cal-month-nav">
                <button 
                  className="cal-nav-btn"
                  onClick={() => setCalendarMonth(prev => {
                    if (prev.month === 0) return { year: prev.year - 1, month: 11 };
                    return { year: prev.year, month: prev.month - 1 };
                  })}
                >
                  ←
                </button>
                <span className="cal-month-label">
                  {new Date(calendarMonth.year, calendarMonth.month, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                </span>
                <button 
                  className="cal-nav-btn"
                  onClick={() => setCalendarMonth(prev => {
                    if (prev.month === 11) return { year: prev.year + 1, month: 0 };
                    return { year: prev.year, month: prev.month + 1 };
                  })}
                >
                  →
                </button>
              </div>
              <div className="cal-grid">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                  <div key={d} className="cal-header">{d}</div>
                ))}
                {calendarDays.map((d, i) => (
                  d.hasPost ? (
                    <Link
                      key={d.dateStr}
                      href={`/?date=${d.dateStr}`}
                      className={`cal-day has-post ${d.isCurrent ? 'selected' : ''} ${d.isOtherMonth ? 'other-month' : ''}`}
                      onClick={() => setCalendarOpen(false)}
                    >
                      {d.day}
                    </Link>
                  ) : (
                    <div 
                      key={d.dateStr} 
                      className={`cal-day ${d.isCurrent ? 'selected' : ''} ${d.isOtherMonth ? 'other-month' : ''}`}
                    >
                      {d.day}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
        
        {next ? (
          <Link href={`/?date=${next}`} className="day-nav-btn">→</Link>
        ) : (
          <span className="day-nav-btn disabled">→</span>
        )}
      </nav>

      {/* Post Card */}
      <article className="post-card">
        <div className="post-meta">
          <span className="post-date-badge">{formatted}</span>
          <span className="post-day-count">Tag {dayCount}</span>
        </div>
        <div className="post-content"><ReactMarkdown>{content}</ReactMarkdown></div>
        
        {/* TIL Section */}
        {tilItems.length > 0 && (
          <div className="til-card">
            <div className="til-header">
              <div className="til-icon">💡</div>
              <span className="til-title">Today I Learned</span>
            </div>
            <ul className="til-list">
              {tilItems.map((item, i) => (
                <li key={i} className="til-item">
                  <span className="til-check">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-6"/>
                    </svg>
                  </span>
                  <span className="til-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Footer */}
      <footer className="footer">
        <p>🦀 Krabbi's Existenz — jeden Tag ein bisschen mehr</p>
        <p className="footer-note">Neuer Post täglich um 07:30 Uhr 🌅</p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Lädt...</div>}>
      <BlogContent />
    </Suspense>
  );
}

import React from 'react';
import { Github } from 'lucide-react';

interface FooterProps {
  theme: 'light' | 'dark';
}

export function Footer({ theme }: FooterProps) {
  return (
    <footer 
      className="footer"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        backgroundColor: theme === 'dark' ? 'rgba(33, 37, 41, 0.95)' : 'rgba(240, 240, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: theme === 'dark' 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.75s ease, border-top 0.75s ease',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: '2rem',
        paddingRight: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a
          href="https://github.com/bul-ikana"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#000000',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '6px',
            transition: 'all 0.2s ease, color 0.75s ease',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (theme === 'dark') {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <Github size={20} />
        </a>
        {/* Add more social icons here later */}
      </div>
    </footer>
  );
}
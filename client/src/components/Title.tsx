import React from 'react';

interface TitleProps {
  theme: 'light' | 'dark';
}

export function Title({ theme }: TitleProps) {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        zIndex: 1000,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <h1 
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 600,
          color: theme === 'dark' ? '#ffffff' : '#000000',
          transition: 'color 0.75s ease, text-shadow 0.75s ease, background 0.75s ease, border 0.75s ease',
          margin: 0,
          fontFamily: '"JetBrains Mono", "Source Code Pro", "Monaco", "Menlo", monospace',
          letterSpacing: '0.1em',
          textShadow: theme === 'dark' 
            ? '0 0 20px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6)'
            : '0 0 20px rgba(255,255,255,0.8), 0 4px 8px rgba(255,255,255,0.6)',
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          padding: '0.3rem 0.7rem',
          borderRadius: '6px',
          backdropFilter: 'blur(10px)',
          border: theme === 'dark' 
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)'
        }}
      >
        bool
      </h1>
    </div>
  );
}

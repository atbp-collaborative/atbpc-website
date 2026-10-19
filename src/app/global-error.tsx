'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError caught critical error]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          backgroundColor: '#F0EFEA',
          color: '#2C2C2C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', padding: '24px', textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              backgroundColor: '#4C6B74',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '-0.05em',
            }}
          >
            ATBP
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            System Encountered an Error
          </h1>

          <p
            style={{
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#666666',
              margin: '0 0 24px',
            }}
          >
            A critical application error occurred. Click below to reload the studio application.
          </p>

          <button
            onClick={() => reset()}
            style={{
              padding: '10px 24px',
              backgroundColor: '#4C6B74',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

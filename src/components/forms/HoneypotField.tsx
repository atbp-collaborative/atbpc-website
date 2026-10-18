'use client';

import React from 'react';
import { HONEYPOT_FIELD_NAME } from '@/lib/security/rate-limit';

/**
 * An invisible trap field rendered within public form submissions.
 * Real users never see or tab into this field.
 * Automated scrapers/bots that fill all detected inputs get trapped and filtered.
 */
export function HoneypotField() {
  return (
    <div
      style={{
        display: 'none',
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <label htmlFor={HONEYPOT_FIELD_NAME}>Leave this field blank</label>
      <input
        type="text"
        id={HONEYPOT_FIELD_NAME}
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

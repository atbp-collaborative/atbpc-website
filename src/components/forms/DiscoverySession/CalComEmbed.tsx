'use client';

import React, { useEffect, useCallback } from 'react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { DiscoverySessionFormData } from '@/lib/forms/discovery.schema';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  formData: DiscoverySessionFormData;
  onBookingSuccess: (calData: any) => void;
}

export const CalComEmbed: React.FC<Props> = ({ formData, onBookingSuccess }) => {
  const { isDarkMode } = useTheme();

  const onBookingSuccessRef = React.useRef(onBookingSuccess);

  useEffect(() => {
    onBookingSuccessRef.current = onBookingSuccess;
  }, [onBookingSuccess]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async function () {
      const cal = await getCalApi();
      cal("ui", { 
        theme: isDarkMode ? "dark" : "light",
        cssVarsPerTheme: {
          light: { "cal-bg": "#EDEFEF" },
          dark: { "cal-bg": "#333436" }
        },
        styles: { branding: { brandColor: isDarkMode ? "#466263" : "#634746" } }, 
        hideEventTypeDetails: true, 
        layout: "month_view" 
      });
      
      const callback = (e: any) => {
        if (onBookingSuccessRef.current) {
          onBookingSuccessRef.current(e.detail);
        }
      };
      
      cal("on", {
        action: "bookingSuccessful",
        callback,
      });

      cleanup = () => {
        cal("off", {
          action: "bookingSuccessful",
          callback,
        });
      };
    })();

    return () => {
      if (cleanup) cleanup();
    };
  }, [isDarkMode]);

  const link = formData.meetingType === 'meet-up' 
    ? "atbpcollaborative/meet-up" 
    : "atbpcollaborative/discovery-meeting";

  return (
    <div className="w-full bg-transparent">
      <Cal 
        key={link}
        calLink={link} 
        style={{ width: "100%" }}
        config={{
          name: formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : "",
          email: formData.email || "",
        }}
      />
    </div>
  );
};

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

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", { 
        theme: isDarkMode ? "dark" : "light",
        cssVarsPerTheme: {
          light: {
            "cal-bg": "#EDEFEF"
          },
          dark: {
            "cal-bg": "#333436"
          }
        },
        styles: { 
          branding: { 
            brandColor: isDarkMode ? "#466263" : "#634746"
          } 
        }, 
        hideEventTypeDetails: true, 
        layout: "month_view" 
      });
      
      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          onBookingSuccess(e.detail);
        },
      });
    })();
  }, [isDarkMode, onBookingSuccess]);

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

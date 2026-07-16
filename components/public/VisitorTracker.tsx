"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Prevent React StrictMode double firing during development
    if (trackedPaths.current.has(pathname)) return;
    trackedPaths.current.add(pathname);

    const trackVisit = async () => {
      try {
        if (typeof window === "undefined") return;

        // Mendata user hanya sekali sehari per device menggunakan localStorage
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const lastTrackedDate = localStorage.getItem("visitor_tracked_date");
        
        if (lastTrackedDate === today) {
          // Sudah tercatat hari ini
          return;
        }

        let browser = "Unknown";
        let os = "Unknown";
        let device = "Desktop";
        let country = "Unknown";
        let city = "Unknown";
        
        const ua = window.navigator.userAgent;
        
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Edge")) browser = "Edge";
        
        if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Mac OS")) os = "MacOS";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        
        if (/Mobi|Android/i.test(ua)) {
          device = "Mobile";
        }

        // Coba dapatkan lokasi dari IP (klien public IP)
        try {
          const geoRes = await fetch("https://get.geojs.io/v1/ip/geo.json");
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            country = geoData.country || "Unknown";
            city = geoData.city || "Unknown";
          }
        } catch (e) {
          console.warn("Could not fetch geo location", e);
        }
        
        const response = await fetch("/api/public/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: window.location.pathname,
            referer: document.referrer ? document.referrer : "Direct",
            browser,
            os,
            device,
            country,
            city,
          }),
        });

        if (response.ok) {
          // Tandai sudah ditrack hari ini jika sukses
          localStorage.setItem("visitor_tracked_date", today);
        }
      } catch (error) {
        // Silently fail if tracking fails
        console.error("Failed to track visitor:", error);
      }
    };
    
    trackVisit();
  }, [pathname]);

  return null;
}

"use client";

import React, { useEffect } from "react";
import { useCMSContent } from "@/context/CMSContentContext";

export default function DynamicFontLoader() {
  const { data } = useCMSContent();

  useEffect(() => {
    if (!data) return;

    // Robustly access custom theme settings from the CMS content
    const theme = (data as any)?.theme;
    if (!theme) return;

    const { headingFont, bodyFont, headingFontUrl, bodyFontUrl } = theme;

    // Helper to dynamically load font stylesheet link
    const loadFontStylesheet = (fontName: string, url: string, id: string) => {
      if (!url) return;
      
      // Check if stylesheet is already loaded
      let linkElement = document.getElementById(id) as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.id = id;
        linkElement.rel = "stylesheet";
        document.head.appendChild(linkElement);
      }
      linkElement.href = url;
    };

    // 1. Dynamic Heading Font
    if (headingFont && headingFontUrl) {
      loadFontStylesheet(headingFont, headingFontUrl, "dynamic-heading-font");
      // Set the CSS variable to override the default Geist font for headings/uppercase
      document.documentElement.style.setProperty(
        "--font-geist",
        `"${headingFont}", var(--font-plus-jakarta-sans), sans-serif`
      );
    }

    // 2. Dynamic Body Font
    if (bodyFont && bodyFontUrl) {
      loadFontStylesheet(bodyFont, bodyFontUrl, "dynamic-body-font");
      // Set the CSS variable to override the default Plus Jakarta Sans font for body text
      document.documentElement.style.setProperty(
        "--font-plus-jakarta-sans",
        `"${bodyFont}", sans-serif`
      );
    }
  }, [data]);

  return null; // This is a logic-only component
}

"use client";

import { useEffect } from "react";

/**
 * Hook to handle smooth scrolling to anchor sections when hash changes.
 * Works reliably with Next.js App Router and fixed headers.
 *
 * @param offset - Offset in pixels to account for fixed headers (default: 112px for 7rem)
 */
export function useHashScroll(offset: number = 112) {
  useEffect(() => {
    // Handle initial page load with hash
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          scrollToHash(hash, offset);
        }, 100);
      }
    };

    // Handle hash changes (user clicks anchor link)
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        scrollToHash(hash, offset);
      }
    };

    // Run on mount
    handleInitialHash();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [offset]);
}

/**
 * Scrolls to element identified by hash with offset for fixed headers
 */
function scrollToHash(hash: string, offset: number) {
  try {
    const id = hash.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  } catch (error) {
    console.warn("Error scrolling to hash:", error);
  }
}

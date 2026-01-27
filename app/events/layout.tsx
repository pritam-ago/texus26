"use client";

import { useEffect } from "react";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Inject purple scrollbar styles for events pages
    const style = document.createElement("style");
    style.id = "events-scrollbar";
    style.textContent = `
      /* Purple Scrollbar for Events Pages */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(89, 0, 89, 0.1);
        border: 1px solid rgba(255, 192, 203, 0.1);
        backdrop-filter: blur(5px);
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          rgba(255, 0, 255, 0.8) 0%,
          rgba(255, 82, 182, 0.9) 50%,
          rgba(255, 0, 255, 0.8) 100%
        );
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 0 10px rgba(255, 0, 255, 0.3),
          inset 0 0 6px rgba(255, 255, 255, 0.2);
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
          180deg,
          rgba(255, 0, 255, 1) 0%,
          rgba(255, 82, 182, 1) 50%,
          rgba(255, 0, 255, 1) 100%
        );
        box-shadow: 0 0 15px rgba(255, 0, 255, 0.5),
          inset 0 0 8px rgba(255, 255, 255, 0.3);
      }

      ::-webkit-scrollbar-thumb:active {
        background: linear-gradient(
          180deg,
          rgba(255, 0, 255, 1) 0%,
          rgba(255, 20, 147, 1) 50%,
          rgba(255, 0, 255, 1) 100%
        );
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.7),
          inset 0 0 10px rgba(255, 255, 255, 0.4);
      }

      /* For Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 0, 255, 0.8) rgba(89, 0, 89, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Clean up the style when leaving events pages
      const existingStyle = document.getElementById("events-scrollbar");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return <>{children}</>;
}

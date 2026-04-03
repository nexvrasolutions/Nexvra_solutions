"use client";

import { useEffect, useState } from "react";

export default function LazyLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  

  useEffect(() => {
    setVisible(sessionStorage.getItem("nexvra_loaded") ? false : true)
    // If already seen this session, remove overlay instantly
    if (sessionStorage.getItem("nexvra_loaded")) {
      document.getElementById("nexvra-loader-overlay")?.remove();
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("nexvra_loaded", "true");
      document.getElementById("nexvra-loader-overlay")?.remove();
    }, 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="nexvra-react-loader"
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-600 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Top green gradient */}
      <div className="absolute top-0 left-0 w-full h-[20vh] lg:h-[30vh] bg-linear-to-t from-transparent to-[rgba(164,255,0,0.3)]" />

      {/* Bottom mirror gradient */}
      <div className="absolute bottom-0 left-0 w-full h-[20vh] lg:h-[30vh] bg-linear-to-b from-transparent to-[rgba(164,255,0,0.12)]" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(164,255,0,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <div
          className="h-px bg-[rgba(164,255,0,0.6)]"
          style={{ width: "0px", animation: "expandLine 0.8s ease forwards 0.3s" }}
        />
        <h1
          className="font-primary text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase"
          style={{
            opacity: 0,
            animation: "fadeSlideUp 0.9s ease forwards 0.6s",
            letterSpacing: "0.18em",
          }}
        >
          Welcome to{" "}
          <span style={{ color: "rgba(164,255,0,1)", textShadow: "0 0 32px rgba(164,255,0,0.55)" }}>
            Nexvra
          </span>{" "}
          Solutions
        </h1>
        <div
          className="h-px bg-[rgba(164,255,0,0.6)]"
          style={{ width: "0px", animation: "expandLine 0.8s ease forwards 0.9s" }}
        />
        <div
          className="flex gap-2 mt-2"
          style={{ opacity: 0, animation: "fadeSlideUp 0.6s ease forwards 1.2s" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-[rgba(164,255,0,0.8)]"
              style={{
                animation: "pulse 1s ease-in-out infinite",
                animationDelay: `${1.2 + i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes expandLine {
          from { width: 0px; } to { width: 180px; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
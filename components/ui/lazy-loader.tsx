"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LazyLoader() {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("nexvra_loaded");

    if (alreadySeen) {
      // Already shown this session: keep the initial "null" state (renders nothing).
      document.getElementById("nexvra-loader-overlay")?.remove();
      return;
    }

    const showTimer = setTimeout(() => setVisible(true), 0);

    const holdTimer = setTimeout(() => setPhase("hold"), 600);
    const exitTimer = setTimeout(() => setPhase("exit"), 2400);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("nexvra_loaded", "true");
      document.getElementById("nexvra-loader-overlay")?.remove();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (visible === null || visible === false) return null;

  return (
    <div className="nl-root" data-phase={phase}>

      {/* ── Background ── */}
      <div className="nl-bg" />
      <div className="nl-grain" />
      <div className="nl-grid" />

      {/* ── Corner marks ── */}
      <div className="nl-corner nl-corner--tl" />
      <div className="nl-corner nl-corner--tr" />
      <div className="nl-corner nl-corner--bl" />
      <div className="nl-corner nl-corner--br" />

      {/* ── Center ── */}
      <div className="nl-center">

        {/* Logo box */}
        <div className="nl-logo-box">
          <div className="nl-logo-ring" />
          <Image
            src="/logo.png"
            alt="Nexvra"
            width={130}
            height={130}
            className="nl-logo-img p-1"
            priority
          />
        </div>

        {/* Brand */}
        {/* <div className="nl-brand">
          <span className="nl-brand-name">Nexvra</span>
          <span className="nl-brand-tag">Solutions</span>
        </div> */}

        {/* Ticker */}
        <div className="nl-ticker">
          <span className="nl-ticker-dot" />
          <span className="nl-ticker-text">Building skills. Building solutions.</span>
        </div>

        {/* Bar */}
        <div className="nl-bar-wrap">
          <div className="nl-bar" />
        </div>

        {/* Meta */}
        <div className="nl-meta">
          <span className="nl-meta-item">v2.0</span>
          <span className="nl-meta-sep" />
          <span className="nl-meta-item">nexvra.com</span>
        </div>
      </div>

      <style>{`
        .nl-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nl-root[data-phase="exit"] { opacity: 0; }

        .nl-bg {
          position: absolute;
          inset: 0;
          background: #080808;
        }

        .nl-grain {
          position: absolute;
          inset: 0;
          opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          pointer-events: none;
        }

        .nl-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(164,255,0,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(164,255,0,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          animation: nlGridFade 0.8s ease forwards;
        }
        @keyframes nlGridFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .nl-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          opacity: 0;
          animation: nlCornerIn 0.4s ease forwards 0.3s;
        }
        .nl-corner--tl { top: 24px; left: 24px; border-top: 1.5px solid rgba(164,255,0,0.5); border-left: 1.5px solid rgba(164,255,0,0.5); }
        .nl-corner--tr { top: 24px; right: 24px; border-top: 1.5px solid rgba(164,255,0,0.5); border-right: 1.5px solid rgba(164,255,0,0.5); }
        .nl-corner--bl { bottom: 24px; left: 24px; border-bottom: 1.5px solid rgba(164,255,0,0.5); border-left: 1.5px solid rgba(164,255,0,0.5); }
        .nl-corner--br { bottom: 24px; right: 24px; border-bottom: 1.5px solid rgba(164,255,0,0.5); border-right: 1.5px solid rgba(164,255,0,0.5); }
        @keyframes nlCornerIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .nl-center {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        /* Logo */
        .nl-logo-box {
          position: relative;
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(164,255,0,0.18);
          border-radius: 24px;
          background: rgba(164,255,0,0.04);
          opacity: 0;
          animation: nlLogoIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards 0.1s;
        }
        @keyframes nlLogoIn {
          from { opacity: 0; transform: scale(0.7) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .nl-logo-ring {
          position: absolute;
          inset: -10px;
          border-radius: 32px;
          border: 1px solid rgba(164,255,0,0.25);
          animation: nlRingPulse 2.2s ease-in-out infinite 0.8s;
        }
        @keyframes nlRingPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 0; transform: scale(1.12); }
        }
        .nl-logo-img {
          object-fit: contain;
          border-radius: 12px;
        }

        /* Brand */
        .nl-brand {
          display: flex;
          align-items: baseline;
          gap: 8px;
          opacity: 0;
          animation: nlSlideUp 0.5s ease forwards 0.5s;
        }
        @keyframes nlSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nl-brand-name {
          font-family: var(--font-onsite, 'Helvetica Neue', sans-serif);
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 2.8rem);
          letter-spacing: -0.01em;
          color: #ffffff;
          line-height: 1;
        }
        .nl-brand-tag {
          font-family: var(--font-inter, sans-serif);
          font-weight: 300;
          font-size: clamp(0.65rem, 1.5vw, 0.78rem);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(164,255,0,0.7);
          padding: 3px 8px;
          border: 1px solid rgba(164,255,0,0.25);
          border-radius: 4px;
          margin-bottom: 2px;
        }

        /* Ticker */
        .nl-ticker {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: nlSlideUp 0.4s ease forwards 0.8s;
        }
        .nl-ticker-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(164,255,0,0.9);
          flex-shrink: 0;
          animation: nlDotBlink 1s ease-in-out infinite 1.2s;
        }
        @keyframes nlDotBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        .nl-ticker-text {
          font-family: var(--font-inter, monospace);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        /* Bar */
        .nl-bar-wrap {
          width: clamp(200px, 38vw, 320px);
          height: 1.5px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
          opacity: 0;
          animation: nlSlideUp 0.4s ease forwards 0.9s;
        }
        .nl-bar {
          height: 100%;
          width: 0%;
          background: rgba(164,255,0,1);
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(164,255,0,0.8);
          animation: nlBarFill 1.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards 1s;
        }
        @keyframes nlBarFill {
          0%   { width: 0%; }
          40%  { width: 55%; }
          70%  { width: 78%; }
          90%  { width: 92%; }
          100% { width: 100%; }
        }

        /* Meta */
        .nl-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          animation: nlSlideUp 0.4s ease forwards 1.1s;
        }
        .nl-meta-item {
          font-family: var(--font-inter, monospace);
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.16);
        }
        .nl-meta-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.16);
        }
      `}</style>
    </div>
  );
}
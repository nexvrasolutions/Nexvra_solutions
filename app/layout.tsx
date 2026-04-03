import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import LazyLoader from "@/components/ui/lazy-loader";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const onsite = localFont({
  src: [
    {
      path: "./fonts/OnsiteExtendedTRIAL-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OnsiteExtendedTRIAL-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OnsiteExtendedTRIAL-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-onsite",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexvra Solutions",
  description:
    "Nexvra Solutions is a leading institute and IT solutions provider offering professional training programs and innovative software development services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(onsite.variable, inter.variable, "font-sans", geist.variable)}>
      <head>
        {/*
          This script runs SYNCHRONOUSLY before the browser paints anything.
          It injects a full-screen black overlay div into <body> immediately,
          so there is zero flash of the hero or any other content.
          Once React mounts and LazyLoader takes over, it removes this div.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (!sessionStorage.getItem('nexvra_loaded')) {
                    var overlay = document.createElement('div');
                    overlay.id = 'nexvra-loader-overlay';
                    overlay.style.cssText = [
                      'position:fixed',
                      'inset:0',
                      'z-index:9998',
                      'background:#000',
                      'display:flex',
                      'align-items:center',
                      'justify-content:center',
                    ].join(';');
                    document.addEventListener('DOMContentLoaded', function() {
                      document.body.appendChild(overlay);
                    });
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-secondary antialiased">
        <LazyLoader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
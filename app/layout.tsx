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

export const metadata = {
  title: {
    default: "Nexvra Solutions",
    template: "%s | Nexvra Solutions",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Nexvra Solutions builds scalable web apps, mobile apps, and provides IT services and professional training.",
  metadataBase: new URL("https://www.nexvrasolutions.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(onsite.variable, inter.variable, "font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                if (sessionStorage.getItem('nexvra_loaded')) return;
                var overlay = document.createElement('div');
                overlay.id = 'nexvra-loader-overlay';
                overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:#050505;';
                // Append immediately to <html> so it covers content before body parses
                document.documentElement.appendChild(overlay);
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
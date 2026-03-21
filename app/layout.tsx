import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
      <body className="font-secondary antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}
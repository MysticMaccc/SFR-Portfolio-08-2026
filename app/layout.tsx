import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sherwin Christopher F. Roxas | Full Stack Developer",
  description:
    "Full Stack Developer with 7+ years of experience building scalable web and mobile applications using React, Next.js, and Laravel.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "Laravel",
    "Philippines",
    "Sherwin Roxas",
    "Web Developer",
    "Mobile Developer",
  ],
  authors: [
    {
      name: "Sherwin Christopher F. Roxas",
      url: "https://github.com/MysticMaccc",
    },
  ],
  openGraph: {
    title: "Sherwin Christopher F. Roxas | Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, and Laravel.",
    type: "website",
    url: "https://sfr-portfolio-2026.vercel.app",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23007AFF'/><text y='.9em' font-size='70' x='12' fill='white' font-family='system-ui' font-weight='bold'>SR</text></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(28, 28, 30, 0.92)",
              color: "#FFFFFF",
              borderRadius: "14px",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "Inter, -apple-system, sans-serif",
              fontSize: "0.9rem",
              fontWeight: "500",
            },
            success: {
              iconTheme: { primary: "#34C759", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#FF3B30", secondary: "white" },
            },
          }}
        />
      </body>
    </html>
  );
}

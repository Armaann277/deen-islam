import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deen Islam ☪",
  description: "Your daily companion for prayer & remembrance",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Deen Islam",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E3D6BF",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#E3D6BF" }}
      >
        {children}
      </body>
    </html>
  );
}

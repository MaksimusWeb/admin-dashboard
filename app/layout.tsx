'use client'

import "./globals.css";
import TopBar from "./components/TopBar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <SessionProvider>
        <TopBar />
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import TopBar from "./components/TopBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <TopBar />
        {children}
      </body>
    </html>
  );
}

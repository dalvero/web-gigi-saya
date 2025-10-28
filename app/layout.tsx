import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aplikasi Edukasi Gigi",
  description: "Aplikasi Edukasi Gigi Pengguna",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Link manual ke Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#949191",
          fontFamily: "'Poppins', sans-serif",
        }}
        suppressHydrationWarning={true}
      >
        {children}        
      </body>
    </html>
  );
}

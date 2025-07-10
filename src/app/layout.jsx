import { Geist_Mono, Inter } from "next/font/google";
import { Navbar } from "./_components/navbar";
import "./globals.css";
import { FileForm } from "./_components/input-file";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Justhrow",
  description: "Upload and forget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <main className="wrapper flex min-h-screen flex-col tracking-tight">
          <Navbar />
          <FileForm />
          {children}
        </main>
      </body>
    </html>
  );
}

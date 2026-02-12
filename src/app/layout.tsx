import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";
import { ToastContainer } from "@/components/ui/toast-container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Inscription Entreprise - FinTrack PRO",
  description: "Simplifiez votre gestion financière avec FinTrack PRO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable}`} suppressHydrationWarning>
       <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white">
        <ReactQueryProvider>
          <Navbar />
          {children}
          <Footer />
          <ToastContainer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

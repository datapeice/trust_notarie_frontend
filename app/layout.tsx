import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: "TrustNotarie - Blockchain Digital Notary",
  description: "Secure document signing on Arbitrum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${ubuntu.className} bg-background text-foreground min-h-screen flex flex-col relative overflow-x-hidden`}>
        <Providers>
          <AnimatedBackground />
          <Header />
          <main className="flex-1 relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

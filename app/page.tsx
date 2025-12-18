'use client';

import { useState, useEffect, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardsRef.current) return;
      
      const cards = cardsRef.current.querySelectorAll('.blur-on-scroll');
      const topBarHeight = 96; // 24 * 4 = 96px (h-24)
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const distanceFromTop = rect.top;
        
        // Calculate blur based on how much the card overlaps with topbar
        if (distanceFromTop < topBarHeight && distanceFromTop > 0) {
          // Card is entering the topbar area
          const overlapPercentage = (topBarHeight - distanceFromTop) / topBarHeight;
          const blurAmount = overlapPercentage * 8; // Max 8px blur
          (card as HTMLElement).style.filter = `blur(${blurAmount}px)`;
        } else if (distanceFromTop <= 0) {
          // Card is fully under topbar
          (card as HTMLElement).style.filter = 'blur(8px)';
        } else {
          // Card is below topbar
          (card as HTMLElement).style.filter = 'blur(0px)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-24 lg:justify-between overflow-hidden relative">
      {/* Gradient fade mask for content under top bar */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#242424] to-transparent z-[99] pointer-events-none lg:hidden"></div>
      
      <div className="fixed lg:static top-2 left-0 right-0 lg:bg-transparent z-[100] max-w-5xl w-full flex items-center justify-between font-mono text-sm py-4 lg:py-0 px-4 lg:px-0">
        {/* Logo - Left on mobile, left on desktop */}
        <div className="lg:static lg:w-auto lg:p-0 flex items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#064e3b] rounded-full px-3 py-1 shadow-lg shadow-green-900/20">
              <span className="font-bold text-[#4ade80] text-sm">TrustNotarie</span>
            </div>
            <span className="text-white font-mono font-bold text-xs">v1.0</span>
          </div>
        </div>

        {/* Mobile Menu Button - ConnectButton as trigger */}
        <div className="lg:hidden z-[101] flex items-center">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }: any) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus || authenticationStatus === 'authenticated');

              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="bg-[#064e3b] text-[#4ade80] hover:bg-[#064e3b]/90 text-xs px-3 py-1 h-auto"
                  >
                    Connect
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" className="text-xs px-3 py-1 h-auto">
                    Wrong Network
                  </Button>
                );
              }

              return (
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 bg-[#2d3748] hover:bg-[#374151] px-2.5 py-1 rounded-lg shadow-lg transition-colors border border-gray-700"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {account.address?.slice(2, 4).toUpperCase() || '??'}
                    </span>
                  </div>
                  <span className="text-white font-medium text-xs">
                    {account.address?.slice(0, 6) || '0x...'}
                  </span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Mobile Slide-out Menu */}
        <div
          className={`fixed inset-0 h-full w-full backdrop-blur-md transform transition-all duration-300 ease-in-out z-[200] lg:hidden ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`absolute top-0 right-0 h-full w-64 bg-[#1a1a1a]/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-800 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col p-6 gap-4 pt-20">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
              </Link>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  mounted,
                }: any) => {
                  return (
                    <Button
                      onClick={() => {
                        openAccountModal();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      Account Details
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Right */}
        <div className="hidden lg:flex lg:items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex flex-col place-items-center justify-center w-full min-h-screen lg:min-h-0 lg:flex-1 lg:py-0 z-0 pt-24 lg:pt-0">
        {/* Animated Background Blobs */}
        {/* Left Blob - Moves towards center */}
        <div className="absolute top-1/4 left-0 lg:left-20 w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bg-gradient-to-r from-[#38ef7d]/40 to-green-600/40 rounded-full blur-[80px] animate-blob-left mix-blend-screen"></div>
        
        {/* Right Blob - Moves towards center */}
        <div className="absolute bottom-1/4 right-0 lg:right-20 w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bg-gradient-to-r from-blue-600/40 to-sky-500/40 rounded-full blur-[80px] animate-blob-right mix-blend-screen"></div>

        <div className="text-center relative z-10 px-4">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white">TrustNotarie</h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8">
            Secure, Blockchain-Powered Document Signing
          </p>
          
          <div className="mt-10">
            <div className="flex justify-center gap-4">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }: any) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                  if (!ready) {
                    return (
                      <Button disabled className="bg-primary/50 text-primary-foreground text-lg px-8 py-6 w-full sm:w-auto">
                        Loading...
                      </Button>
                    );
                  }

                  if (!connected) {
                    return (
                      <Button
                        className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 text-lg px-8 py-6 cursor-pointer relative z-50 w-full sm:w-auto font-bold"
                        onClick={openConnectModal}
                      >
                        Connect Wallet to Start
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button onClick={openChainModal} variant="destructive" className="text-lg px-8 py-6 cursor-pointer relative z-50 w-full sm:w-auto">
                        Wrong Network
                      </Button>
                    );
                  }

                  return (
                    <Link href="/create" className="w-full sm:w-auto">
                      <Button className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 text-lg px-8 py-6 cursor-pointer relative z-50 w-full font-bold">
                        Create New Document
                      </Button>
                    </Link>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-8 px-4 z-10">
        <Card className="bg-card/30 backdrop-blur-md border-border blur-on-scroll transition-all duration-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center lg:justify-start">
              <Wallet className="h-6 w-6 text-primary" />
              Web3 Auth
            </CardTitle>
            <CardDescription>
              Login securely with your MetaMask wallet. No passwords required.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card/30 backdrop-blur-md border-border blur-on-scroll transition-all duration-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center lg:justify-start">
              <FileSignature className="h-6 w-6 text-primary" />
              Digital Signing
            </CardTitle>
            <CardDescription>
              Sign documents digitally and store proofs on Arbitrum blockchain.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-card/30 backdrop-blur-md border-border blur-on-scroll transition-all duration-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center lg:justify-start">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Secure Storage
            </CardTitle>
            <CardDescription>
              Documents are encrypted and stored securely in the cloud.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}


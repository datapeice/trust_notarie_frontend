'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show on home page (has custom header)
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#064e3b] rounded-full px-3 py-1 shadow-lg shadow-green-900/20">
              <span className="font-bold text-[#4ade80] text-sm">TrustNotarie</span>
            </div>
            <span className="text-white font-mono font-bold text-xs">v1.0</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
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

                return (
                  <>
                    {connected && (
                      <Link href="/dashboard">
                        <Button variant="ghost">Dashboard</Button>
                      </Link>
                    )}
                    <ConnectButton />
                  </>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
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
        </div>
      </header>

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
    </>
  );
}

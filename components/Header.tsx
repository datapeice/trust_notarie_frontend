'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show this header on the home page as it has its own custom header
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">TrustNotarie</span>
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">v1.0</code>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className={`transition-colors hover:text-foreground/80 ${pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'}`}>
              Dashboard
            </Link>
            <Link href="/create" className={`transition-colors hover:text-foreground/80 ${pathname === '/create' ? 'text-foreground' : 'text-foreground/60'}`}>
              Create
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/create" 
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Document
            </Link>
            <div className="pt-2">
              <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

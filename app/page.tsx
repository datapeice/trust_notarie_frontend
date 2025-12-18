'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-24 overflow-hidden relative">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center pt-8 lg:static lg:w-auto lg:p-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#064e3b] rounded-full px-5 py-1.5 shadow-lg shadow-green-900/20">
              <span className="font-bold text-[#4ade80] text-lg">TrustNotarie</span>
            </div>
            <span className="text-white font-mono font-bold">v1.0</span>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background via-background dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none lg:items-center gap-4 z-50 lg:z-auto pb-8 lg:pb-0">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex place-items-center justify-center w-full py-20 lg:py-0">
        {/* Animated Background Blobs */}
        {/* Left Blob - Moves towards center */}
        <div className="absolute top-1/4 -left-10 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-[#38ef7d]/40 to-green-600/40 rounded-full blur-[80px] animate-blob-left mix-blend-screen"></div>
        
        {/* Right Blob - Moves towards center */}
        <div className="absolute bottom-1/4 -right-10 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-blue-600/40 to-sky-500/40 rounded-full blur-[80px] animate-blob-right mix-blend-screen"></div>

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
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

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
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 cursor-pointer relative z-50 w-full sm:w-auto"
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

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-8 px-4">
        <Card className="bg-card border-border">
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

        <Card className="bg-card border-border">
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

        <Card className="bg-card border-border">
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


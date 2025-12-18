'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
<<<<<<< HEAD
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
=======
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 animate-[bg-pan_14s_linear_infinite] opacity-70" style={{ background: 'radial-gradient(120% 120% at 10% 20%, rgba(56,239,125,0.25), transparent 45%), radial-gradient(120% 120% at 80% 10%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(120% 120% at 50% 80%, rgba(109,40,217,0.25), transparent 40%)' }} />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10 md:py-14">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-primary">TrustNotarie</span>
            <span className="text-sm text-slate-300">v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-700 bg-slate-900/40 text-white hover:bg-slate-800">Dashboard</Button>
            </Link>
            <ConnectButton />
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">Secure, Blockchain-Powered Document Signing</h1>
              <p className="text-lg text-slate-300">Create, send, and sign documents with on-chain proofs on Arbitrum. Simple, secure, and wallet-first.</p>
            </div>

            <div className="flex flex-wrap gap-3">
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
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
<<<<<<< HEAD
                      <Button disabled className="bg-primary/50 text-primary-foreground text-lg px-8 py-6 w-full sm:w-auto">
                        Loading...
                      </Button>
=======
                      <Button disabled className="bg-primary/40 text-primary-foreground px-6 py-3 text-base">Loading...</Button>
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
                    );
                  }

                  if (!connected) {
                    return (
<<<<<<< HEAD
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 cursor-pointer relative z-50 w-full sm:w-auto"
                        onClick={openConnectModal}
                      >
=======
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base" onClick={openConnectModal}>
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
                        Connect Wallet to Start
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
<<<<<<< HEAD
                      <Button onClick={openChainModal} variant="destructive" className="text-lg px-8 py-6 cursor-pointer relative z-50 w-full sm:w-auto">
=======
                      <Button onClick={openChainModal} variant="destructive" className="px-6 py-3 text-base">
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
                        Wrong Network
                      </Button>
                    );
                  }

                  return (
<<<<<<< HEAD
                    <Link href="/create" className="w-full sm:w-auto">
                      <Button className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 text-lg px-8 py-6 cursor-pointer relative z-50 w-full font-bold">
=======
                    <Link href="/create">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base">
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
                        Create New Document
                      </Button>
                    </Link>
                  );
                }}
              </ConnectButton.Custom>

              <Link href="/dashboard">
                <Button variant="secondary" className="bg-slate-800 text-white hover:bg-slate-700 px-6 py-3 text-base">Go to Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-primary" /> Web3 Auth
                </CardTitle>
                <CardDescription>Login securely with your MetaMask wallet. No passwords required.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSignature className="h-6 w-6 text-primary" /> Digital Signing
                </CardTitle>
                <CardDescription>Sign documents digitally and store proofs on Arbitrum blockchain.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" /> Secure Storage
                </CardTitle>
                <CardDescription>Documents are encrypted and stored securely in the cloud.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>

<<<<<<< HEAD
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
=======
      <style jsx global>{`
        @keyframes bg-pan {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-6%, -4%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
      `}</style>
>>>>>>> be0015e115a79b1158ff501003ecf9508361cc51
    </main>
  );
}


'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
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
                      <Button disabled className="bg-primary/40 text-primary-foreground px-6 py-3 text-base">Loading...</Button>
                    );
                  }

                  if (!connected) {
                    return (
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base" onClick={openConnectModal}>
                        Connect Wallet to Start
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button onClick={openChainModal} variant="destructive" className="px-6 py-3 text-base">
                        Wrong Network
                      </Button>
                    );
                  }

                  return (
                    <Link href="/create">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base">
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

      <style jsx global>{`
        @keyframes bg-pan {
          0% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-6%, -4%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
      `}</style>
    </main>
  );
}


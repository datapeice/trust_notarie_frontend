'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, FileSignature, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          TrustNotarie &nbsp;
          <code className="font-mono font-bold">v1.0</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none lg:items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-sky-900 after:via-[#38ef7d] after:opacity-40 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#38ef7d] after:dark:opacity-40 before:lg:h-[360px]">
        <div className="text-center relative z-10">
          <h1 className="text-6xl font-bold mb-4 text-primary">TrustNotarie</h1>
          <p className="text-xl text-muted-foreground mb-8">
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
                      <Button disabled className="bg-primary/50 text-primary-foreground text-lg px-8 py-6">
                        Loading...
                      </Button>
                    );
                  }

                  if (!connected) {
                    return (
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 cursor-pointer relative z-50"
                        onClick={openConnectModal}
                      >
                        Connect Wallet to Start
                      </Button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <Button onClick={openChainModal} variant="destructive" className="text-lg px-8 py-6 cursor-pointer relative z-50">
                        Wrong Network
                      </Button>
                    );
                  }

                  return (
                    <Link href="/create">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 cursor-pointer relative z-50">
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

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
            <CardTitle className="flex items-center gap-2">
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
            <CardTitle className="flex items-center gap-2">
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


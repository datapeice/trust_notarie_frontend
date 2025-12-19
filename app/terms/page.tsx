import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-32 max-w-4xl text-white">
      {/* Gradient fade mask for content under top bar */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#242424] to-transparent z-[99] pointer-events-none lg:hidden"></div>
      
      <h1 className="text-3xl font-bold mb-6">User Agreement (Terms of Service)</h1>
      
      <div className="space-y-4 text-gray-300">
        <p>Last updated: December 19, 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
          <p>
            Welcome to TrustNotarie. This is a pet project created by Illia Datsiuk (@datapeice) for educational and demonstration purposes. 
            By accessing or using our service, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Nature of Service</h2>
          <p>
            TrustNotarie is a decentralized application (dApp) running on the Arbitrum testnet (Sepolia). 
            <strong> This service is provided "AS IS" and is NOT a legal notary service. </strong> 
            Documents signed here may not hold legal weight in your jurisdiction. 
            Please do not use this for critical legal documents requiring official notarization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Blockchain Transactions</h2>
          <p>
            Transactions are recorded on the Arbitrum blockchain. Once written, data cannot be altered or deleted. 
            You are responsible for managing your own private keys and wallet security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Limitation of Liability</h2>
          <p>
            The author and contributors shall not be held liable for any damages arising from the use of this service, 
            including but not limited to data loss, smart contract failures, or legal disputes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Contact</h2>
          <p>
            For support or inquiries, please contact: <a href="mailto:support@tnotarie.app" className="text-primary hover:underline">support@tnotarie.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}

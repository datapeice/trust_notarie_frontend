import React from 'react';

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-32 max-w-4xl text-white">
      {/* Gradient fade mask for content under top bar */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#242424] to-transparent z-[99] pointer-events-none lg:hidden"></div>

      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="space-y-4 text-gray-300">
        <p>Last updated: December 19, 2025</p>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. How We Use Cookies</h2>
          <p>
            TrustNotarie uses minimal cookies essential for the operation of the application:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Authentication:</strong> We use cookies/local storage to maintain your session state when you connect your Web3 wallet (e.g., via RainbowKit/Wagmi).
            </li>
            <li>
              <strong>Preferences:</strong> To remember your UI preferences.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party Cookies</h2>
          <p>
            We do not use third-party tracking cookies or analytics services that sell your data. 
            However, interacting with the blockchain via your wallet provider (like MetaMask) may involve their own policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Managing Cookies</h2>
          <p>
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
          </p>
        </section>
      </div>
    </div>
  );
}

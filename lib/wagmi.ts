import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (WalletConnect project id)');
}

export const config = getDefaultConfig({
  appName: 'TrustNotarie',
  projectId,
  chains: [arbitrumSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

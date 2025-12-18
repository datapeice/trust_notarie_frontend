import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (WalletConnect project id)');
}

export const config = getDefaultConfig({
  appName: 'TrustNotarie',
  projectId,
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc'),
  },
  ssr: true,
});

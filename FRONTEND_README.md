# 🔐 TrustNotarie Frontend - Integration Guide

> **Blockchain-Powered Digital Notary Service**  
> Secure document signing with MetaMask authentication and Arbitrum blockchain verification

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack Requirements](#tech-stack-requirements)
4. [User Flow](#user-flow)
5. [API Integration](#api-integration)
6. [MetaMask Integration](#metamask-integration)
7. [Stripe Payment Integration](#stripe-payment-integration)
8. [Page Requirements](#page-requirements)
9. [TypeScript Types](#typescript-types)
10. [Environment Variables](#environment-variables)
11. [Security Best Practices](#security-best-practices)

---

## 🎯 Overview

**TrustNotarie** is a decentralized digital notary service that allows users to:
- Create and sign documents digitally
- Authenticate via MetaMask wallet
- Pay for services via Stripe
- Record signatures immutably on Arbitrum blockchain
- Access personal document dashboard

### Key Features
- ✅ **MetaMask Authentication** - Web3 wallet-based login
- ✅ **Email Notifications** - Mailgun-powered invitations
- ✅ **Blockchain Verification** - Arbitrum Sepolia testnet
- ✅ **Secure Storage** - Cloud Storage (S3/Azure/Local)
- ✅ **Payment Processing** - Stripe integration
- ✅ **Flexible Payment** - User A or User B can pay

---

## 🏗 Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│  Frontend   │─────▶│   Backend    │─────▶│  Blockchain     │
│  (React)    │      │   (Go API)   │      │  (Arbitrum)     │
└─────────────┘      └──────────────┘      └─────────────────┘
       │                    │                        
       │                    ├──────────┐─────────────┐             
       │                    │          │             │
       ▼                    ▼          ▼             ▼
┌─────────────┐      ┌──────────┐  ┌─────────┐  ┌────────┐
│   MetaMask  │      │PostgreSQL│  │  Cloud  │  │Mailgun │
│   Wallet    │      │ Database │  │ Storage │  │ Email  │
└─────────────┘      └──────────┘  └─────────┘  └────────┘
       │
       │
       ▼
┌─────────────┐
│   Stripe    │
│   Payment   │
└─────────────┘
```

---

## 🛠 Tech Stack Requirements

### Recommended Frontend Stack
- **Framework**: Next.js 14+ (App Router) or React 18+
- **Styling**: TailwindCSS + shadcn/ui (customized for dark theme)
- **Design System**: Ubuntu style (dark background #242424, green buttons)
- **Typography**: Ubuntu font family
- **State Management**: Zustand or React Query
- **Web3**: 
  - `wagmi` (React hooks for Ethereum)
  - `viem` (Ethereum library)
  - `@rainbow-me/rainbowkit` (wallet connection UI)
- **Payment**: `@stripe/stripe-js`, `@stripe/react-stripe-js`
- **HTTP Client**: Axios or native fetch
- **Forms**: React Hook Form + Zod validation
- **File Upload**: react-dropzone

### Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "wagmi": "^2.0.0",
    "viem": "^2.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "react-dropzone": "^14.2.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Note:** Install Ubuntu font:
```bash
# Add to your HTML head or globals.css
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
```
  }
}
```

---

## 👤 User Flow

### Flow 1: Document Creation (User A)

```
1. User A connects MetaMask wallet
   ↓
2. User A fills form:
   - Upload document (PDF, DOC, etc.)
   - Enter personal info (name, email)
   - Enter signer info (User B's email, name)
   ↓
3. (Optional) User A pays $5 fee
   ↓
4. Document uploaded to Azure Blob
   ↓
5. Email sent to User B with signing link
   ↓
6. User A can track document status in dashboard
```

### Flow 2: Document Signing (User B)

```
1. User B receives email with unique link
   ↓
2. User B clicks link → opens signing page
   ↓
3. User B connects MetaMask wallet
   ↓
4. User B enters personal info
   ↓
5. User B reviews document
   ↓
6. If User A didn't pay → User B pays $5
   ↓
7. User B confirms signature
   ↓
8. Backend records signature on blockchain
   ↓
9. Both users receive confirmation emails
   ↓
10. Document appears in both dashboards
```

---

## 🔌 API Integration

### Base URL
```
Production: https://api.tnotarie.app/api/v1
Development: http://localhost:8080/api/v1
```

### Authentication
All protected endpoints require JWT token in header:
```typescript
headers: {
  'Authorization': `Bearer ${jwtToken}`
}
```

---

### 📡 API Endpoints

#### 1. **Authentication**

##### Get Auth Challenge
```http
POST /auth/challenge
```

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"
}
```

**Response:**
```json
{
  "message": "Welcome to TrustNotarie!\n\nClick \"Sign\" to authenticate...",
  "nonce": "a1b2c3d4e5f6..."
}
```

##### Verify Signature
```http
POST /auth/verify
```

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  "message": "Welcome to TrustNotarie!...",
  "signature": "0xabcdef..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "0x742d35cc6634c0532925a3b844bc9e7595f0beb1",
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb1",
    "email": "",
    "firstName": "",
    "lastName": "",
    "createdAt": "2024-12-01T10:00:00Z",
    "lastLoginAt": "2024-12-01T10:00:00Z"
  }
}
```

---

#### 2. **User Management** (Protected)

##### Get Current User
```http
GET /user/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "0x742d35cc6634c0532925a3b844bc9e7595f0beb1",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-12-01T10:00:00Z",
  "emailVerified": true
}
```

##### Update User
```http
PUT /user/me
Authorization: Bearer {token}
```

**Request:**
```json
{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

#### 3. **Document Management** (Protected)

##### Create Document
```http
POST /documents
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**FormData Fields:**
```typescript
{
  file: File,                    // Document file
  ownerEmail: string,            // User A email
  ownerFirstName: string,        // User A first name
  ownerLastName: string,         // User A last name
  signerEmail: string,           // User B email
  signerFirstName: string,       // User B first name
  signerLastName: string         // User B last name
}
```

**Response:**
```json
{
  "document": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "documentHash": "0xabcdef1234567890...",
    "fileName": "contract.pdf",
    "fileSize": 1048576,
    "fileType": "application/pdf",
    "blobUrl": "https://storage.blob.core.windows.net/...",
    "ownerAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb1",
    "ownerEmail": "owner@example.com",
    "signerEmail": "signer@example.com",
    "status": "sent",
    "createdAt": "2024-12-01T10:00:00Z",
    "sentAt": "2024-12-01T10:00:30Z",
    "paymentStatus": "pending",
    "signingToken": "abc123def456"
  }
}
```

##### Get User Documents
```http
GET /documents
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "contract.pdf",
    "status": "signed",
    "createdAt": "2024-12-01T10:00:00Z",
    "signedAt": "2024-12-01T11:00:00Z",
    "blockchainTxHash": "0xabc123...",
    "paymentStatus": "paid_by_a"
  }
]
```

##### Get Single Document
```http
GET /documents/:id
Authorization: Bearer {token}
```

---

#### 4. **Public Signing Endpoints**

##### Get Document by Token (No Auth)
```http
GET /document/:token
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "contract.pdf",
  "fileSize": 1048576,
  "ownerName": "John Doe",
  "signerEmail": "signer@example.com",
  "status": "sent",
  "createdAt": "2024-12-01T10:00:00Z",
  "expiresAt": "2024-12-08T10:00:00Z"
}
```

##### Sign Document (No Auth)
```http
POST /sign/:token
Content-Type: multipart/form-data
```

**FormData Fields:**
```typescript
{
  signerAddress: string,         // User B wallet address
  signerEmail: string,
  signerFirstName: string,
  signerLastName: string,
  signature: string,             // MetaMask signature
  message: string,               // Signed message
  paymentIntentId?: string       // If User B pays
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "signed",
    "blockchainTxHash": "0xabc123...",
    "blockchainBlockNumber": 12345678
  }
}
```

---

#### 5. **Payment** (Protected)

##### Create Payment Intent
```http
POST /payment/create-intent
Authorization: Bearer {token}
```

**Request:**
```json
{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_yyy",
  "publishableKey": "pk_test_...",
  "amount": 500
}
```

##### Confirm Payment
```http
POST /payment/confirm
Authorization: Bearer {token}
```

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

---

## 🦊 MetaMask Integration

### Setup wagmi + RainbowKit

```typescript
// app/providers.tsx
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'TrustNotarie',
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID',
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.Node }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Authentication Hook

```typescript
// hooks/useAuth.ts
import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  );

  const login = async () => {
    if (!address) throw new Error('No wallet connected');

    setIsLoading(true);
    try {
      // Step 1: Get challenge
      const { data } = await axios.post(`${API_URL}/auth/challenge`, {
        address,
      });

      // Step 2: Sign message with MetaMask
      const signature = await signMessageAsync({
        message: data.message,
      });

      // Step 3: Verify signature and get JWT
      const { data: authData } = await axios.post(`${API_URL}/auth/verify`, {
        address,
        message: data.message,
        signature,
      });

      // Store token
      localStorage.setItem('authToken', authData.token);
      setToken(authData.token);

      return authData;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return {
    address,
    isConnected,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };
}
```

---

## 💳 Stripe Payment Integration

### Setup Stripe

```typescript
// app/providers.tsx (add to existing)
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

### Payment Component

```typescript
// components/PaymentForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

export function PaymentForm({ documentId, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay $5.00'}
      </button>
    </form>
  );
}
```

---

## 📄 Page Requirements

### 1. **Landing Page** (`/`)
- Hero section explaining TrustNotarie
- "Get Started" CTA → Connect MetaMask
- Features showcase
- How it works section

### 2. **Create Document Page** (`/create`)
**Requirements:**
- ✅ Protected route (requires authentication)
- ✅ File upload dropzone (max 10MB)
- ✅ Form fields:
  - Owner (auto-filled from wallet)
  - Owner email, first name, last name
  - Signer email, first name, last name
- ✅ Optional payment section (User A can pay now)
- ✅ Submit button → creates document + sends email

**UI Components:**
```typescript
<CreateDocumentForm>
  <FileUpload />
  <OwnerInfoSection />
  <SignerInfoSection />
  <OptionalPaymentSection />
  <SubmitButton />
</CreateDocumentForm>
```

### 3. **Dashboard** (`/dashboard`)
**Requirements:**
- ✅ Protected route
- ✅ Display user's documents in table
- ✅ Columns:
  - File name
  - Status (pending, sent, signed)
  - Signer
  - Date created
  - Date signed
  - Blockchain link
  - Payment status
- ✅ Filter by status
- ✅ Search by filename
- ✅ Pagination

### 4. **Sign Document Page** (`/sign/[token]`)
**Requirements:**
- ✅ Public route (no auth initially)
- ✅ Fetch document by token
- ✅ Display document info (owner, filename, etc.)
- ✅ Download/preview document
- ✅ Connect MetaMask button
- ✅ Form for signer info
- ✅ Payment section (if User A didn't pay)
- ✅ Signature confirmation
- ✅ Success screen with blockchain link

**Flow:**
```
1. Load document by token
2. Show document preview
3. Connect wallet button
4. Fill signer information
5. Pay (if needed)
6. Sign with MetaMask
7. Submit to backend
8. Show success + blockchain TX
```

### 5. **Document Details Page** (`/documents/[id]`)
**Requirements:**
- ✅ Protected route
- ✅ Full document details
- ✅ Download button
- ✅ Blockchain verification link
- ✅ Timeline of events
- ✅ Both parties' information

---

## 📦 TypeScript Types

```typescript
// types/index.ts

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export type DocumentStatus = 
  | 'pending' 
  | 'sent' 
  | 'signed' 
  | 'cancelled' 
  | 'expired';

export type PaymentStatus = 
  | 'pending' 
  | 'paid_by_a' 
  | 'paid_by_b' 
  | 'failed';

export interface Document {
  id: string;
  documentHash: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  blobUrl: string;
  ownerAddress: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  signerAddress?: string;
  signerEmail: string;
  signerFirstName: string;
  signerLastName: string;
  status: DocumentStatus;
  createdAt: string;
  sentAt?: string;
  signedAt?: string;
  blockchainTxHash?: string;
  blockchainBlockNumber?: number;
  paymentStatus: PaymentStatus;
  paidBy?: string;
  paymentIntentId?: string;
}

export interface CreateDocumentRequest {
  file: File;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  signerEmail: string;
  signerFirstName: string;
  signerLastName: string;
}

export interface SignDocumentRequest {
  signerAddress: string;
  signerEmail: string;
  signerFirstName: string;
  signerLastName: string;
  signature: string;
  message: string;
  paymentIntentId?: string;
}
```

---

## 🔐 Environment Variables

```bash
# .env.local

# API
NEXT_PUBLIC_API_URL=https://api.tnotarie.app/api/v1

# Blockchain
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# App
NEXT_PUBLIC_APP_URL=https://tnotarie.app
```

---

## 🛡 Security Best Practices

### 1. **Token Storage**
```typescript
// ✅ Good: HttpOnly cookies (if possible)
// ✅ Acceptable: localStorage with expiry check
// ❌ Bad: No expiry validation

const isTokenExpired = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
};
```

### 2. **Input Validation**
```typescript
import { z } from 'zod';

const documentSchema = z.object({
  ownerEmail: z.string().email(),
  ownerFirstName: z.string().min(2).max(50),
  ownerLastName: z.string().min(2).max(50),
  signerEmail: z.string().email(),
  signerFirstName: z.string().min(2).max(50),
  signerLastName: z.string().min(2).max(50),
  file: z.instanceof(File).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'File size must be less than 10MB'
  ),
});
```

### 3. **File Upload Security**
```typescript
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
];

const validateFile = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type) && 
         file.size <= 10 * 1024 * 1024;
};
```

### 4. **Signature Verification**
```typescript
// Always verify on backend, but client-side check:
const verifySignature = async (
  address: string,
  message: string,
  signature: string
): Promise<boolean> => {
  const recoveredAddress = await verifyMessage({
    address,
    message,
    signature,
  });
  return recoveredAddress.toLowerCase() === address.toLowerCase();
};
```

---

## 🎨 UI/UX Recommendations

### Design System - Ubuntu Style

#### Color Palette
- **Background:** `#242424` (dark charcoal)
- **Primary/Buttons:** `#38ef7d` or `#77DD77` (Ubuntu green)
- **Hover State:** `#5FE89D` (lighter green)
- **Text Primary:** `#FFFFFF` (white)
- **Text Secondary:** `#E0E0E0` (light gray)
- **Success:** `#38ef7d` (green)
- **Error:** `#E95420` (Ubuntu orange for errors)
- **Warning:** `#F39C12` (orange)
- **Border/Divider:** `#3C3C3C` (subtle dark gray)

#### Typography
- **Font Family:** `Ubuntu, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Sizes:**
  - H1: `2.5rem` (40px) - Bold
  - H2: `2rem` (32px) - Medium
  - H3: `1.5rem` (24px) - Medium
  - Body: `1rem` (16px) - Regular
  - Small: `0.875rem` (14px) - Regular

#### Button Styles
```css
/* Primary Button (Ubuntu Green) */
.btn-primary {
  background: #38ef7d;
  color: #242424;
  font-weight: 500;
  border-radius: 4px;
  padding: 12px 24px;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #5FE89D;
  box-shadow: 0 4px 12px rgba(56, 239, 125, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #38ef7d;
  border: 2px solid #38ef7d;
  font-weight: 500;
  border-radius: 4px;
  padding: 12px 24px;
}

.btn-secondary:hover {
  background: rgba(56, 239, 125, 0.1);
}
```

### Components
1. **Connect Wallet Button** - Green button, always visible in header
2. **Document Status Badge** - Color-coded by status (green/orange/gray)
3. **Progress Stepper** - Ubuntu green active states
4. **Toast Notifications** - Dark background (#2D2D2D) with green/orange accents
5. **Loading Skeleton** - Subtle shimmer on dark background
6. **Empty States** - Light text on dark background with green CTA button
7. **Cards** - Dark cards (#2D2D2D) with subtle border (#3C3C3C)
8. **Inputs** - Dark background (#1A1A1A), light text, green focus border

### Layout
- **Page Background:** `#242424`
- **Card/Panel Background:** `#2D2D2D`
- **Header/Footer:** `#1A1A1A` (darker shade)
- **Border Radius:** `4px` (Ubuntu style - subtle corners)
- **Spacing:** Use 8px base unit (8, 16, 24, 32, 48, 64)

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly buttons (min 44px height)
- Adequate spacing on mobile (min 16px padding)

### TailwindCSS Config Example
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ubuntu: {
          bg: '#242424',
          card: '#2D2D2D',
          header: '#1A1A1A',
          border: '#3C3C3C',
          green: '#38ef7d',
          'green-hover': '#5FE89D',
          orange: '#E95420',
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
    },
  },
}

---

## 📊 Analytics Events to Track

```typescript
// Track important user actions
trackEvent('wallet_connected', { address });
trackEvent('document_created', { documentId, fileType });
trackEvent('payment_initiated', { documentId, amount });
trackEvent('payment_completed', { documentId, paidBy });
trackEvent('document_signed', { documentId, txHash });
```

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure CORS origins in backend
- [ ] Test MetaMask connection on production domain
- [ ] Test Stripe in live mode
- [ ] Verify email links work with production URL
- [ ] Test file upload limits
- [ ] Enable HTTPS
- [ ] Setup error monitoring (Sentry)
- [ ] Configure CDN for static assets

---

## 📞 Backend API Contact

**Base URL:** `https://api.tnotarie.app`  
**Health Check:** `GET /health`  
**API Version:** `v1`  

**Support:** Contact backend team for:
- New endpoint requests
- Bug reports
- Rate limiting issues
- Webhook integration help

---

## 🎓 Learning Resources

- [Wagmi Docs](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)

---

## ✅ Final Notes

1. **Payment Logic:** If `paymentStatus === 'pending'`, show payment form to current user
2. **Token Expiry:** Signing tokens expire after 7 days
3. **Network:** Always use Arbitrum Sepolia (Chain ID: 421614)
4. **Gas Fees:** Backend pays all gas fees (gasless for users)
5. **File Storage:** Files stored in Cloud Storage, only hash on blockchain

**Good luck building! 🚀**

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCheck, ShieldCheck, AlertCircle, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';

interface SignatureInfo {
  id: string;
  documentHash: string;
  fileName: string;
  ownerAddress: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  signerAddress?: string;
  signerFirstName?: string;
  signerLastName?: string;
  signerEmail?: string;
  status: string;
  createdAt: string;
  signedAt?: string;
  blockchainTxHash?: string;
  blockchainBlockNumber?: number;
}

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignatureInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);

  // Вычисление SHA-256 хеша файла
  const calculateFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setFileHash(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
      setFileHash(null);
    }
  };

  const handleVerify = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Вычислить хеш файла
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      // Отправить хеш на backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-document`, {
        documentHash: `0x${hash}`
      });

      if (response.data && response.data.length > 0) {
        setResult(response.data);
      } else {
        setError('Document not found in our system');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to verify document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-8 pt-24 lg:pt-32 relative">
      {/* Gradient fade mask */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#242424] to-transparent z-[99] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">
        <Card className="bg-card/30 backdrop-blur-md border-border mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#38ef7d] flex items-center gap-2">
              <ShieldCheck className="h-7 w-7" />
              Verify Document Signature
            </CardTitle>
            <CardDescription>
              Upload a document to check if it has been signed and verify its authenticity on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#38ef7d] transition-colors cursor-pointer relative"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <FileCheck className="h-16 w-16 text-[#38ef7d]" />
                  <div>
                    <p className="font-semibold text-white">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setResult(null);
                      setError(null);
                      setFileHash(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-white">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, TXT, PNG, JPG (max 50MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Verify Button */}
            {file && (
              <Button
                onClick={handleVerify}
                disabled={loading}
                className="w-full mt-6 bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying Document...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verify Document
                  </>
                )}
              </Button>
            )}

            {/* File Hash */}
            {fileHash && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Document Hash (SHA-256):</p>
                <p className="font-mono text-xs break-all text-[#38ef7d]">{fileHash}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/50 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="font-semibold text-red-500">Verification Failed</p>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && result.length > 0 && (
          <Card className="bg-card/30 backdrop-blur-md border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <CardTitle className="text-green-500">Document Verified ✓</CardTitle>
                  <CardDescription>This document has been found in our system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.map((doc, index) => (
                <div key={index} className="p-6 bg-muted/30 rounded-lg space-y-4">
                  {/* Document Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">File Name</p>
                      <p className="font-semibold">{doc.fileName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={doc.status === 'signed' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Owner */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Document Owner</p>
                    <div className="bg-background/50 p-3 rounded">
                      <p className="font-semibold">{doc.ownerFirstName} {doc.ownerLastName}</p>
                      <p className="text-sm text-muted-foreground">{doc.ownerEmail}</p>
                      <p className="text-xs font-mono text-muted-foreground">{doc.ownerAddress}</p>
                    </div>
                  </div>

                  {/* Signer */}
                  {doc.signerAddress && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Signed By</p>
                      <div className="bg-background/50 p-3 rounded">
                        <p className="font-semibold">{doc.signerFirstName} {doc.signerLastName}</p>
                        <p className="text-sm text-muted-foreground">{doc.signerEmail}</p>
                        <p className="text-xs font-mono text-muted-foreground">{doc.signerAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Blockchain */}
                  {doc.blockchainTxHash && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Blockchain Record</p>
                      <div className="bg-background/50 p-3 rounded space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Transaction Hash:</p>
                          <a
                            href={`https://sepolia.arbiscan.io/tx/${doc.blockchainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-[#38ef7d] hover:underline flex items-center gap-1"
                          >
                            {doc.blockchainTxHash.slice(0, 10)}...{doc.blockchainTxHash.slice(-8)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        {doc.blockchainBlockNumber && (
                          <div>
                            <p className="text-xs text-muted-foreground">Block Number:</p>
                            <p className="text-xs font-mono">{doc.blockchainBlockNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm">{new Date(doc.createdAt).toLocaleString()}</p>
                    </div>
                    {doc.signedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">Signed</p>
                        <p className="text-sm">{new Date(doc.signedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  fileName: string;
  status: 'pending' | 'sent' | 'signed' | 'cancelled' | 'expired';
  signerEmail: string;
  createdAt: string;
  signedAt?: string;
  blockchainTxHash?: string;
  paymentStatus: string;
}

export default function Dashboard() {
  const { token, isAuthenticated, isConnected, login, isLoading: authLoading, logout } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (token) {
      fetchDocuments();
    } else if (!authLoading && !isAuthenticated) {
        setLoading(false);
    }
  }, [token, authLoading, isAuthenticated]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch documents', error);
      if (error.response && error.response.status === 401) {
        logout(); // Token expired or invalid
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = (documents || []).filter(doc => 
    doc.fileName.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (!isConnected) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Please connect your wallet to view dashboard</h1>
              </div>
          </div>
      )
  }

  if (!isAuthenticated) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="mb-4 text-muted-foreground">Please sign the message to verify your ownership of the wallet.</p>
                <Button onClick={login}>Sign In with Wallet</Button>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 pt-24 lg:pt-32">
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">My Documents</h1>

      <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <div className="flex flex-row justify-between items-center gap-4">
            <CardTitle className="text-white">Documents</CardTitle>
            <Link href="/create" className="shrink-0">
              <Button className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 font-bold">
                <span className="hidden sm:inline">Create New Document</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            <Input 
              placeholder="Search by filename..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signer</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Signed</TableHead>
                    <TableHead>Blockchain</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDocuments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">No documents found</TableCell>
                        </TableRow>
                    ) : (
                        filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {doc.fileName}
                            </TableCell>
                            <TableCell>
                                <Badge variant={doc.status === 'signed' ? 'default' : 'secondary'}>
                                    {doc.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{doc.signerEmail}</TableCell>
                            <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{doc.signedAt ? new Date(doc.signedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                                {doc.blockchainTxHash ? (
                                    <a href={`https://sepolia.arbiscan.io/tx/${doc.blockchainTxHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                                        View <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                ) : '-'}
                            </TableCell>
                            <TableCell>
                                <Link href={`/documents?id=${doc.id}`}>
                                    <Button variant="ghost" size="sm">Details</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                </TableBody>
                </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

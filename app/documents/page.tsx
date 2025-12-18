'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, ExternalLink, FileText, ArrowLeft } from 'lucide-react';

// Dynamic import to avoid SSR issues with PDF.js
const DocumentViewer = dynamicImport(() => import('@/components/DocumentViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
});

export const dynamic = 'force-dynamic';

function DocumentDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && id) {
      fetchDocument(id);
    } else if (!authLoading && !isAuthenticated) {
        setLoading(false);
    }
  }, [token, id, authLoading, isAuthenticated]);

  const fetchDocument = async (docId: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocument(response.data);
    } catch (error) {
      console.error('Failed to fetch document', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!document) return <div className="p-8 text-center">Document not found</div>;

  return (
    <div className="container mx-auto p-4 lg:p-8 pt-24 lg:pt-32 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-white">Document Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/30 backdrop-blur-md border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Information</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const url = document.blobUrl.startsWith('http') 
                    ? document.blobUrl 
                    : process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + document.blobUrl;
                  window.open(url, '_blank');
                }} 
                className="md:hidden"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">File Name</h3>
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                {document.fileName}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <Badge variant={document.status === 'signed' ? 'default' : 'secondary'}>
                {document.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Created At</h3>
              <p>{new Date(document.createdAt).toLocaleString()}</p>
            </div>
            {document.signedAt && (
              <div>
                <h3 className="font-semibold mb-1">Signed At</h3>
                <p>{new Date(document.signedAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-md border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Parties</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const url = document.blobUrl.startsWith('http') 
                    ? document.blobUrl 
                    : process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + document.blobUrl;
                  window.open(url, '_blank');
                }} 
                className="hidden md:flex"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Owner</h3>
              <p>{document.ownerFirstName} {document.ownerLastName}</p>
              <p className="text-sm text-muted-foreground">{document.ownerEmail}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{document.ownerAddress}</p>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-1">Signer</h3>
              <p>{document.signerFirstName} {document.signerLastName}</p>
              <p className="text-sm text-muted-foreground">{document.signerEmail}</p>
              {document.signerAddress && (
                <p className="text-xs text-muted-foreground font-mono mt-1">{document.signerAddress}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Viewer */}
      <div className="mt-6">
        <DocumentViewer 
          fileUrl={document.blobUrl.startsWith('http') 
            ? document.blobUrl 
            : process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + document.blobUrl
          }
          fileName={document.fileName}
        />
      </div>
    </div>
  );
}

export default function DocumentDetails() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
      <DocumentDetailsContent />
    </Suspense>
  );
}

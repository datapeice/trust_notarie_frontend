'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, ExternalLink, FileText } from 'lucide-react';

function DocumentDetailsContent() {
  const searchParams = useSearchParams();
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
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Details</h1>
        <Button variant="outline" onClick={() => window.open(document.blobUrl, '_blank')}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Parties</CardTitle>
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

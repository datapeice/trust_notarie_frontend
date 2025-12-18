'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileText, Download } from 'lucide-react';
import axios from 'axios';

export default function PreviewPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to preview endpoint
    const previewUrl = `${process.env.NEXT_PUBLIC_API_URL}/preview/${documentId}`;
    window.location.href = previewUrl;
  }, [documentId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <Card className="bg-card/30 backdrop-blur-md border-border max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#38ef7d]" />
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Loading Document...</h2>
              <p className="text-sm text-muted-foreground">
                You will be redirected to the document preview
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

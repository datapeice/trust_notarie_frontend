'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
}

export default function DocumentViewer({ fileUrl, fileName }: DocumentViewerProps) {
  return (
    <Card className="bg-card/30 backdrop-blur-md border-border">
      <CardContent className="pt-6">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">
            Click the button below to download and view the document.
          </p>
          <Button
            onClick={() => window.open(fileUrl, '_blank')}
            className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90 font-bold"
          >
            <Download className="mr-2 h-4 w-4" /> Download Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

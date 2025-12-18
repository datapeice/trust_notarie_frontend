'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
}

export default function DocumentViewer({ fileUrl, fileName }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const changeScale = (delta: number) => {
    setScale((prevScale) => {
      const newScale = prevScale + delta;
      return Math.min(Math.max(0.5, newScale), 2.0);
    });
  };

  // Check if file is PDF
  const isPDF = fileName.toLowerCase().endsWith('.pdf');

  if (!isPDF) {
    return (
      <Card className="bg-card/30 backdrop-blur-md border-border">
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">
              Preview is only available for PDF files. Please download to view this document.
            </p>
            <Button
              onClick={() => window.open(fileUrl, '_blank')}
              className="bg-[#38ef7d] text-black hover:bg-[#38ef7d]/90"
            >
              <Download className="mr-2 h-4 w-4" /> Download Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/30 backdrop-blur-md border-border">
      <CardContent className="pt-6">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages || '--'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeScale(-0.1)}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeScale(0.1)}
              disabled={scale >= 2.0}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="border border-border rounded-lg overflow-auto max-h-[600px] bg-muted/20 flex justify-center">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-8">
                <div className="animate-pulse text-muted-foreground">Loading PDF...</div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center p-8 text-red-500">
                <p className="mb-4">Failed to load PDF</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Instead
                </Button>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="overflow-auto border rounded bg-background p-2 max-h-[70vh]">
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        onLoadError={() => setError(true)}
        className="flex flex-col items-center gap-2"
      >
        {error ? (
          <p className="text-sm text-red-500">Unable to render PDF.</p>
        ) : (
          Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          ))
        )}
      </Document>
    </div>
  );
}

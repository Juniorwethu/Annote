import React from 'react';
import { Document, Page } from 'react-pdf';

interface Annotation {
  id: string;
  type: 'highlight' | 'note';
  page: number;
  x: number;
  y: number;
  text?: string;
}

interface PDFViewerProps {
  file: File | null;
  annotations: Annotation[];
  currentTool: string;
  onAddAnnotation: (page: number, x: number, y: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, annotations, currentTool, onAddAnnotation }) => {
  if (!file) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>No PDF uploaded</div>;
  }

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, page: number) => {
    if (currentTool) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      onAddAnnotation(page, x, y);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <Document file={file} onLoadSuccess={(pdf) => console.log(`Loaded ${pdf.numPages} pages`)}>
        {Array.from({ length: 3 }, (_, index) => ( // Show first 3 pages; can be dynamic
          <div
            key={index + 1}
            style={{ position: 'relative', marginBottom: '20px' }}
            onClick={(e) => handlePageClick(e, index + 1)}
          >
            <Page pageNumber={index + 1} width={600} />
            {annotations
              .filter(ann => ann.page === index + 1)
              .map(ann => (
                <div
                  key={ann.id}
                  style={{
                    position: 'absolute',
                    top: `${ann.y}%`,
                    left: `${ann.x}%`,
                    background: ann.type === 'highlight' ? 'yellow' : 'blue',
                    color: ann.type === 'note' ? 'white' : 'transparent',
                    padding: ann.type === 'note' ? '5px' : '10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title={ann.type === 'note' ? ann.text : ''}
                >
                  {ann.type === 'note' ? 'Note' : ''}
                </div>
              ))}
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;

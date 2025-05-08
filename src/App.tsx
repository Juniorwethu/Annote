import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './App.css';

// Import the worker from pdfjs-dist (use legacy version to ensure compatibility)
import { GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';
// Dynamically set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type Annotation = {
  id: number;
  page: number;
  type: 'highlight' | 'comment' | 'note';
  content: string;
};

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [redoStack, setRedoStack] = useState<Annotation[][]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setAnnotations([]);
      setHistory([]);
      setRedoStack([]);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const addAnnotation = (page: number, type: Annotation['type']) => {
    const content = prompt(`Enter ${type} content:`) || '';
    const newAnnotation: Annotation = {
      id: Date.now(),
      page,
      type,
      content,
    };
    const newAnnotations = [...annotations, newAnnotation];
    setHistory([...history, annotations]);
    setAnnotations(newAnnotations);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setRedoStack([annotations, ...redoStack]);
      setAnnotations(prev);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setHistory([...history, annotations]);
      setAnnotations(next);
      setRedoStack(redoStack.slice(1));
    }
  };

  const deleteAnnotation = (id: number) => {
    const newAnnotations = annotations.filter(a => a.id !== id);
    setHistory([...history, annotations]);
    setAnnotations(newAnnotations);
  };

  const removePdf = () => {
    setPdfFile(null);
    setAnnotations([]);
    setHistory([]);
    setRedoStack([]);
  };

  return (
    <div className="app">
      <h1>Annote App 📄🖊️</h1>

      {!pdfFile && (
        <div>
          <label htmlFor="file-upload">Upload PDF:</label>
          <input id="file-upload" type="file" accept="application/pdf" onChange={onFileChange} />
        </div>
      )}

      {pdfFile && (
        <div>
          <div className="toolbar">
            <button onClick={() => undo()} disabled={history.length === 0}>Undo</button>
            <button onClick={() => redo()} disabled={redoStack.length === 0}>Redo</button>
            <button onClick={removePdf}>Remove PDF</button>
          </div>

          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <div key={index} className="page-container">
                <Page pageNumber={index + 1} width={600} />

                <div className="annotations">
                  {annotations
                    .filter(a => a.page === index + 1)
                    .map(a => (
                      <div key={a.id} className={`annotation ${a.type}`}>
                        <strong>{a.type.toUpperCase()}: </strong>
                        {a.content}
                        <button onClick={() => deleteAnnotation(a.id)}>❌</button>
                      </div>
                    ))}
                </div>

                <div className="annotation-tools">
                  <button onClick={() => addAnnotation(index + 1, 'highlight')}>Highlight</button>
                  <button onClick={() => addAnnotation(index + 1, 'comment')}>Comment</button>
                  <button onClick={() => addAnnotation(index + 1, 'note')}>Note</button>
                </div>
              </div>
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default App;

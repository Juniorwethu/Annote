import React, { useState } from 'react';
import HighlightOverlay from './HighlightOverlay';
import CommentOverlay from './CommentOverlay';
import NoteOverlay from './NoteOverlay';
import styles from '../styles/AnnotationArea.module.css';

interface AnnotationAreaProps {
  activeTool: 'highlight' | 'comment' | 'note' | null;
}

interface Annotation {
  id: number;
  type: 'highlight' | 'comment' | 'note';
  x: number;
  y: number;
  text?: string;
}

const AnnotationArea: React.FC<AnnotationAreaProps> = ({ activeTool }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const handleAddAnnotation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool) return;

    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation: Annotation = {
      id: Date.now(),
      type: activeTool,
      x,
      y,
    };

    if (activeTool === 'comment' || activeTool === 'note') {
      const text = prompt(`Enter ${activeTool}:`) || '';
      newAnnotation.text = text;
    }

    setAnnotations((prev) => [...prev, newAnnotation]);
  };

  return (
    <div className={styles.annotationArea} onClick={handleAddAnnotation}>
      <div className={styles.fakeDocument}>
        {/* Render annotations */}
        {annotations.map((annotation) => {
          if (annotation.type === 'highlight') {
            return <HighlightOverlay key={annotation.id} x={annotation.x} y={annotation.y} />;
          }
          if (annotation.type === 'comment') {
            return (
              <CommentOverlay
                key={annotation.id}
                x={annotation.x}
                y={annotation.y}
                text={annotation.text!}
              />
            );
          }
          if (annotation.type === 'note') {
            return (
              <NoteOverlay
                key={annotation.id}
                x={annotation.x}
                y={annotation.y}
                text={annotation.text!}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default AnnotationArea;

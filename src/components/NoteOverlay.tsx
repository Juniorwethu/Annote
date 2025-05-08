import React from 'react';
import styles from '../styles/AnnotationArea.module.css';

interface NoteOverlayProps {
  x: number;
  y: number;
  text: string;
}

const NoteOverlay: React.FC<NoteOverlayProps> = ({ x, y, text }) => {
  return (
    <div className={styles.note} style={{ top: y, left: x }}>
      📝 {text}
    </div>
  );
};

export default NoteOverlay;

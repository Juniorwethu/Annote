import React from 'react';
import styles from '../styles/AnnotationArea.module.css';

interface HighlightOverlayProps {
  x: number;
  y: number;
}

const HighlightOverlay: React.FC<HighlightOverlayProps> = ({ x, y }) => {
  return <div className={styles.highlight} style={{ top: y, left: x }} />;
};

export default HighlightOverlay;

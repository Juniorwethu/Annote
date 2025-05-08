import React from 'react';
import styles from '../styles/AnnotationArea.module.css';

interface CommentOverlayProps {
  x: number;
  y: number;
  text: string;
}

const CommentOverlay: React.FC<CommentOverlayProps> = ({ x, y, text }) => {
  return (
    <div className={styles.comment} style={{ top: y, left: x }}>
      💬 {text}
    </div>
  );
};

export default CommentOverlay;

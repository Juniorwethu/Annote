import React from 'react';

interface ToolbarProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteEdits: () => void;
  onRemovePDF: () => void;
  onSetTool: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onUpload, onDeleteEdits, onRemovePDF, onSetTool, onUndo, onRedo }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '10px', borderBottom: '1px solid #ccc' }}>
      <label style={{ cursor: 'pointer' }}>
        Upload PDF
        <input type="file" accept="application/pdf" onChange={onUpload} hidden />
      </label>
      <button onClick={onDeleteEdits}>Delete Edits</button>
      <button onClick={onRemovePDF}>Remove PDF</button>
      <button onClick={() => onSetTool('highlight')}>Highlight</button>
      <button onClick={() => onSetTool('note')}>Add Note</button>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
    </div>
  );
};

export default Toolbar;

import React from 'react';
import { TheThinkingProcessVisual } from './TheThinkingProcessVisual';

export const ArchiveAssetSlot: React.FC = () => {
  return (
    <div 
      className="cinematic-hero-asset-mount"
      style={{
        width: '100%',
        marginTop: 'clamp(32px, 5vw, 64px)',
        position: 'relative'
      }}
    >
      <TheThinkingProcessVisual />
    </div>
  );
};

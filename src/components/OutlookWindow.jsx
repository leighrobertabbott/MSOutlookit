import React, { useState, useEffect, useRef, Suspense } from 'react';
import AccountInfoWindow from './AccountInfoWindow';
import ComposeWindow from './ComposeWindow';
import './OutlookWindow.css';

function OutlookWindow({ window, onClose, onUpdate, onBringToFront, onOpenOptions }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !window.isMaximized) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onUpdate({
          position: { x: Math.max(0, newX), y: Math.max(0, newY) }
        });
      } else if (isResizing && !window.isMaximized) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newWidth = Math.max(400, dragStart.width + deltaX);
        const newHeight = Math.max(300, dragStart.height + deltaY);
        onUpdate({
          size: { width: newWidth, height: newHeight }
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, window.isMaximized, onUpdate]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-header')) {
      onBringToFront();
      if (!window.isMaximized) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - window.position.x,
          y: e.clientY - window.position.y
        });
      }
    }
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
  };

  const handleMinimize = () => {
    onUpdate({ isMinimized: true });
  };

  const handleMaximize = () => {
    if (window.isMaximized) {
      onUpdate({
        isMaximized: false,
        position: window.oldPosition || { x: 100, y: 100 },
        size: window.oldSize || { width: 800, height: 600 }
      });
    } else {
      const parentWidth = windowRef.current?.parentElement?.clientWidth || globalThis.innerWidth || 1920;
      const parentHeight = windowRef.current?.parentElement?.clientHeight || globalThis.innerHeight || 1080;
      onUpdate({
        oldPosition: window.position,
        oldSize: window.size,
        isMaximized: true,
        position: { x: 0, y: 0 },
        size: {
          width: parentWidth,
          height: parentHeight
        }
      });
    }
  };

  if (window.isMinimized) {
    return (
      <div
        className="window-minimized"
        style={{ zIndex: window.zIndex }}
        onClick={() => onUpdate({ isMinimized: false })}
      >
        {window.title}
      </div>
    );
  }

  const style = {
    zIndex: window.zIndex,
    left: window.isMaximized ? 0 : `${window.position.x}px`,
    top: window.isMaximized ? 0 : `${window.position.y}px`,
    width: window.isMaximized ? '100%' : `${window.size.width}px`,
    height: window.isMaximized ? '100%' : `${window.size.height}px`,
    maxWidth: window.isMaximized ? '100%' : 'none',
    maxHeight: window.isMaximized ? '100%' : 'none'
  };

  return (
    <div
      ref={windowRef}
      className={`outlook-window ${window.isMaximized ? 'maximized' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      <div className="window-header">
        <div className="window-title">{window.title}</div>
        <div className="window-controls">
          <button className="window-button minimize" onClick={handleMinimize} title="Minimize">−</button>
          <button className="window-button maximize" onClick={handleMaximize} title={window.isMaximized ? "Restore" : "Maximize"}>
            {window.isMaximized ? '❐' : '□'}
          </button>
          <button className="window-button close" onClick={onClose} title="Close">×</button>
        </div>
      </div>
      <div className="window-content">
        {window.component === 'ComposeWindow' ? (
          <ComposeWindow onClose={onClose} />
        ) : window.component === 'AccountInfo' ? (
          <AccountInfoWindow onClose={onClose} onOpenOptions={onOpenOptions} />
        ) : (
          <div className="window-body">{window.content || 'Window content'}</div>
        )}
      </div>
      {!window.isMaximized && (
        <div
          className="window-resize-handle"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
}

function ComposeWindowContent() {
  return <ComposeWindow />;
}

export default OutlookWindow;


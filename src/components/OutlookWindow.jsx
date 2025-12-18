import React, { useState, useEffect, useRef, Suspense } from 'react';
import AccountInfoWindow from './AccountInfoWindow';
import './OutlookWindow.css';

function OutlookWindow({ window, onClose, onUpdate, onBringToFront }) {
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
          <ComposeWindowContent />
        ) : window.component === 'AccountInfo' ? (
          <AccountInfoWindowContent />
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

function AccountInfoWindowContent() {
  return <AccountInfoWindow />;
}

function ComposeWindowContent() {
  return (
    <div className="compose-window">
      <div className="compose-header">
        <div className="compose-field">
          <label>To:</label>
          <input type="text" placeholder="Enter recipient name or email address" />
        </div>
        <div className="compose-field">
          <label>Subject:</label>
          <input type="text" />
        </div>
      </div>
      <div className="compose-body">
        <textarea placeholder="Type your message here..."></textarea>
      </div>
      <div className="compose-footer">
        <button className="compose-send">Send</button>
        <button className="compose-cancel">Discard</button>
      </div>
    </div>
  );
}

export default OutlookWindow;


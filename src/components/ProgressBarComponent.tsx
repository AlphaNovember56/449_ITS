import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface ProgressBarComponentProps {
  progress: number; // 0-100
  label?: string;
  variant?: 'success' | 'info' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({
  progress,
  label,
  variant = 'info',
  size = 'md',
}) => {
  const getBarHeight = () => {
    switch (size) {
      case 'sm':
        return '5px';
      case 'lg':
        return '25px';
      default:
        return '15px';
    }
  };

  return (
    <div className="progress-container" style={{ marginBottom: '10px' }}>
      {label && <small className="progress-label">{label}</small>}
      <ProgressBar
        now={progress}
        label={`${progress}%`}
        variant={variant}
        style={{
          height: getBarHeight(),
          fontSize: size === 'lg' ? '14px' : '12px',
        }}
      />
    </div>
  );
};

export default ProgressBarComponent;

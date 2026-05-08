import React from 'react';
import styles from './clickableContent.module.css';

interface ClickableContentProps {
  label: string;
  children?: JSX.Element | JSX.Element[];
  dispatch: () => void;
}

function ClickableContent({
  label,
  children,
  dispatch,
}: Readonly<ClickableContentProps>) {
  return (
    <button
      className={styles.clickableDiv}
      aria-label={`Visa innehåll i ${label}`}
      aria-pressed="false"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch();
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          dispatch();
        }
      }}
    >
      {children}
    </button>
  );
}

export default ClickableContent;

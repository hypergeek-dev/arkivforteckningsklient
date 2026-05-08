import React from 'react';

type Props = {
  children: JSX.Element | JSX.Element[];
  style?: React.CSSProperties;
};

const Wrapper: React.FC<Props> = ({ children, style }) => (
  <div
    style={{
      margin: '100px auto 0 auto',
      padding: '0px 50px 0 50px',
      ...style,
    }}
  >
    {children}
  </div>
);

export default Wrapper;

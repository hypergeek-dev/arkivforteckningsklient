import { Slide } from '@mui/material';
import Wrapper from 'Scenarios/components/Wrapper';
import React, { useState } from 'react';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';

const WelcomePage = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const duration = 200;
  const style: React.CSSProperties = {
    display: 'flex',
    width: '80vw',
    justifyContent: 'center',
  };

  return (
    <Wrapper style={{ marginTop: '100px', paddingTop: '0' }}>
      <div>
        <Slide
          timeout={duration}
          direction="down"
          in={currentPage === 0}
          mountOnEnter
          unmountOnExit
        >
          <div style={style}>
            <FirstPage onclick={() => setCurrentPage(1)} />
          </div>
        </Slide>
        <Slide
          direction="up"
          timeout={duration}
          in={currentPage === 1}
          mountOnEnter
          unmountOnExit
        >
          <div style={style}>
            <SecondPage onclick={() => setCurrentPage(0)} />
          </div>
        </Slide>
      </div>
    </Wrapper>
  );
};

export default WelcomePage;

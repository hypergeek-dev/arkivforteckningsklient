import { PageHeading } from 'Scenarios/components/Typos';
import Wrapper from 'Scenarios/components/Wrapper';
import * as React from 'react';
import EventOverview from './EventOverview';
import EventSearch from './EventSearch';
import Tabs from './components/Tabs';
import { Container, useTheme } from '@mui/material';
import CompareNode from './components/CompareNode';

export default function EventLogg() {
  const theme = useTheme();
  return (
    <Wrapper
      style={{
        padding: 0,
        marginTop: 0,
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
        minHeight: '100vh',
        paddingBottom: '6rem',
        color: theme.palette.text.primary,
      }}
    >
      <div
        style={{
          paddingTop: '90px',
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : 'rgb(33, 33, 33)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container>
          <PageHeading>Händelselogg</PageHeading>
        </Container>
      </div>
      <Tabs child1={<EventOverview />} child2={<EventSearch />} />
      <CompareNode />
    </Wrapper>
  );
}

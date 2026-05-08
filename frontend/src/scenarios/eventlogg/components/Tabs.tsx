import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { actions } from 'Store/ducks/eventlogg/reducer';
import { useAppDispatch } from 'Store/hooks';
import * as React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          backgroundColor:
            theme.palette.mode === 'light'
              ? '#FFFFFF'
              : theme.palette.background.paper,
          padding: '1rem',
          paddingRight: '5rem',
          minHeight: 'calc(100vh - 255px)',
        })}
      >
        {children}
      </Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  child1,
  child2,
}: Readonly<{
  child1: JSX.Element;
  child2: JSX.Element;
}>) {
  const [value, setValue] = React.useState(1);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(actions.reset());
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab
            label="Översikt händelser"
            sx={{ mr: 3, fontSize: '0.9rem' }}
            {...a11yProps(0)}
          />
          <Tab
            label="Sök i logg"
            sx={{ fontSize: '0.9rem' }}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {child1}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {child2}
      </TabPanel>
    </Box>
  );
}

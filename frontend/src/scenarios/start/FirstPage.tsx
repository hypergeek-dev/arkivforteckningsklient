import { KeyboardArrowDown } from '@mui/icons-material';
import {
  Card,
  CardContent,
  Divider,
  Grid2,
  IconButton,
  Typography,
} from '@mui/material';
import { selectThemeSelected } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import darkWordmark from '../../img/skanearkiv_wordmark_dark.svg';
import lightWordmark from '../../img/skanearkiv_wordmark_light.svg';

const FirstPage: React.FC<{ onclick: () => void }> = ({ onclick }) => {
  const themeSelected = useAppSelector(selectThemeSelected);
  return (
    <Card sx={{ width: 600, borderRadius: 20 }}>
      <CardContent>
        <Grid2 container>
          <Grid2
            size={{ xs: 12 }}
            sx={{ display: 'flex', justifyContent: 'center', paddingTop: 4, paddingBottom: 6 }}
          >
            {themeSelected === 'dark' ? (
              <img
                src={lightWordmark}
                height={80}
                alt="Skånearkiv förteckningsklient"
              />
            ) : (
              <img
                src={darkWordmark}
                height={80}
                alt="Skånearkiv förteckningsklient"
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ padding: '20px 0' }}>
            <Divider />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center' }} variant="h1">
              Välkommen
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center' }} variant="h2">
              Verktyg för upprättande och förvaltning av arkivförteckningar
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ padding: '20px 0' }}>
            <Divider />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center' }} variant="h2">
              Läs mer
            </Typography>
          </Grid2>
          <Grid2
            size={{ xs: 12 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <IconButton
              size="large"
              title="Visa mer om förteckningsklienten"
              aria-label="Läs mer"
              onClick={onclick}
            >
              <KeyboardArrowDown />
            </IconButton>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};

export default FirstPage;

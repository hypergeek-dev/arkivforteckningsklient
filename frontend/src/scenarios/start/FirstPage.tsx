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
import IHPv_logo_with_text_black from '../../img/Isolated_IHPv_logo_with_text_black.png';
import IHPv_logo_with_text_white from '../../img/Isolated_IHPv_logo_with_text_neg.png';
import blackLogo from '../../img/blackLogo.png';
import whiteLogo from '../../img/whiteLogo.png';

const FirstPage: React.FC<{ onclick: () => void }> = ({ onclick }) => {
  const themeSelected = useAppSelector(selectThemeSelected);
  return (
    <Card sx={{ width: 600, borderRadius: 20 }}>
      <CardContent>
        <Grid2 container>
          <Grid2
            size={{ xs: 12 }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            {themeSelected === 'dark' ? (
              <img
                src={whiteLogo}
                height={48}
                alt="Migrationsverkets logotyp vit"
              />
            ) : (
              <img
                src={blackLogo}
                height={48}
                alt="Migrationsverkets logotyp svart"
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ padding: '20px 0' }}>
            <Divider />
          </Grid2>
          <Grid2
            size={{ xs: 12 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 10,
            }}
          >
            {themeSelected === 'dark' ? (
              <img
                src={IHPv_logo_with_text_white}
                height={120}
                alt="IHP logotyp vit"
              />
            ) : (
              <img
                src={IHPv_logo_with_text_black}
                height={120}
                alt="IHP logotyp svart"
              />
            )}
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center' }} variant="h1">
              Välkommen till IHP-verktyget
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Typography sx={{ textAlign: 'center' }} variant="h2">
              Migrationsverkets applikation för informationsstyrning
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
              title="Visa mer om IHP..."
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

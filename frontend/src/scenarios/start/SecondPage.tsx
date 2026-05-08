import {
  AccountTree,
  AutoDelete,
  Build,
  FileDownload,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Grid2, IconButton, Typography } from '@mui/material';
import React from 'react';
import Information_flow_Team_isolated from '../../img/Information_flow_Team_isolated.png';

const SecondPage: React.FC<{ onclick: () => void }> = ({ onclick }) => {
  return (
    <Grid2 sx={{ width: 600 }} container>
      <Grid2 size={{ xs: 6 }}>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="h2">
          Hur används IHP-verktyget?
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          Migrationsverket hanterar sina handlingar enligt gällande regler i
          informationshanteringsplanen, IHP. Med IHP-verktyget kan
          Migrationsverket förvalta klassificeringsstrukturen och
          informationshanteringsplanen digitalt samt omsätta regelverket i
          informationshanteringsplanen i myndighetens system.
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          IHP-verktyget huvudsakliga uppgifter är; tillhandahålla struktur och
          innehåll för informationsstyrning (exempelvis för att kunna läsas av
          handläggarstöd), erbjuda insyn och transparens kring Migrationsverkets
          informationshantering samt garantera att den hanteringen efterlever
          tillämpliga lagar och förordningar.
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          <b>Värdeflödesteamen</b> kartlägger sina processers informationsflöden
          och skapar handlingstyper samt föreslår hanteringsregler, direkt i
          IHP-verktyget.
        </Typography>
        <Typography sx={{ width: '100%' }} variant="body1">
          <b>Verksarkivarierna</b> på Migrationsverket stödjer
          värdeflödesteamens arbete genom att använda IHP-verktyget för att
          granska och godkänna informationshanteringsplanen innan fastställande.
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 6 }}>
        <img
          src={Information_flow_Team_isolated}
          height={400}
          alt="bild föreställande man som håller i ett kort och under honom en kvinna som sitter framför ett annat kort."
        />
      </Grid2>
      <Grid2
        size={{ xs: 12 }}
        sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}
      >
        <Grid2 sx={{ width: 600 }} container>
          <Grid2 size={{ xs: 1 }}>
            <Build />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Skapa informationsstyrning för processer och andra värdeflöden
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <AccountTree />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Granska, jämföra och fastställa (endast Verksarkivarier) innehåll
            och struktur
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <AutoDelete />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Ställa in villkor för borttagande av handlingar, s.k. Gallringsfrist
            (endast Verksarkivarier)
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <FileDownload />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Visa Informationshanteringsplan och ladda ned rapporter
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2
        size={{ xs: 12 }}
        sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}
      >
        <IconButton
          size="large"
          title="Visa första sidan"
          aria-label="Visa första sidan"
          onClick={onclick}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Typography sx={{ textAlign: 'center' }} variant="h2">
          Tillbaka
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default SecondPage;

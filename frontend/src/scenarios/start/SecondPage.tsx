import {
  AccountTree,
  AutoDelete,
  FileDownload,
  KeyboardArrowUp,
  UploadFile,
} from '@mui/icons-material';
import { Grid2, IconButton, Typography } from '@mui/material';
import React from 'react';

const SecondPage: React.FC<{ onclick: () => void }> = ({ onclick }) => {
  return (
    <Grid2 sx={{ width: 600 }} container>
      <Grid2 size={{ xs: 12 }}>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="h2">
          Vad är förteckningsklienten?
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          Förteckningsklienten är ett webbaserat verktyg för Skånearkiv för att
          upprätta, förvalta och fastställa arkivförteckningar enligt svensk
          arkivredovisningsstandard. Verktyget ersätter interimistiskt Visual
          Arkiv för detta ändamål.
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          Arkivförteckningen byggs upp i en hierarki:{' '}
          <b>Arkivbildare → Arkiv → Serie → Underserie → Volym</b>. Varje
          nivå har egna metadatafält anpassade för arkivredovisning, såsom
          seriesignum, förvaringsplats och verksamhetsperiod.
        </Typography>
        <Typography sx={{ width: '100%', marginBottom: 2 }} variant="body1">
          <b>Arkivansvariga</b> upprättar och fastställer arkivförteckningen.{' '}
          <b>Arkivarier</b> administrerar och importerar. <b>Läsare</b> har
          läsbehörighet.
        </Typography>
      </Grid2>
      <Grid2
        size={{ xs: 12 }}
        sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}
      >
        <Grid2 sx={{ width: 600 }} container rowSpacing={1}>
          <Grid2 size={{ xs: 1 }}>
            <AccountTree />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Bygg och förvalta arkivförteckningens hierarki med drag-och-släpp
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <AutoDelete />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Koppla gallrings- och bevaranderegler med RA-FS-referens och
            rättslig grund
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <FileDownload />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Exportera Fastställd Arkivförteckning som JSON-rapport
          </Grid2>

          <Grid2 size={{ xs: 1 }}>
            <UploadFile />
          </Grid2>
          <Grid2 size={{ xs: 11 }}>
            Importera en tidigare exporterad arkivförteckning
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

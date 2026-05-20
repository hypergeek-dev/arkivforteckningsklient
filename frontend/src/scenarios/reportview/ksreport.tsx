import { Button, Grid2, Stack, ThemeProvider } from '@mui/material';
import { ModelControllerService } from 'Models/index';
import RestHeaders from 'Services/RestHeaders';
import {
  selectActiveEstablishedData,
  selectEstablishedWithIHP,
} from 'Store/ducks/data/selectors';
import { selectAuthUser, selectUserName } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React, { useState } from 'react';
import { darkTheme } from '../../theme';
import IhpTextFormat from './components/IhpTextFormat';

const KsReport: React.FC = () => {
  const auth = useAppSelector(selectAuthUser);
  const [includeIhp, setIncludeIHP] = useState<boolean>(false);
  const userName = useAppSelector(selectUserName);
  const snap = useAppSelector(selectActiveEstablishedData);
  const withIhp = useAppSelector(selectEstablishedWithIHP);

  const downloadIhp = async () => {
    if (auth) {
      try {
        const jsonObj = await ModelControllerService.getActiveEstablishedSnap({
          ...RestHeaders.get,
          auth: userName,
        });

        // Skapa en Blob från JSON-objektet
        const blob = new Blob(
          [
            typeof jsonObj.modelb === 'string'
              ? jsonObj.modelb
              : JSON.stringify(jsonObj.modelb),
          ],
          {
            type: 'application/json',
          }
        );

        // Skapa en temporär länk för nedladdning
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'FaststalldArkivforteckning.json';
        document.body.appendChild(link);
        link.click();

        // Rensa upp
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading IHP:', error);
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid2
        container
        spacing={2}
        sx={{
          backgroundColor: '#323639',
          marginTop: '4rem',
          paddingRight: '1rem',
          width: '100%',
        }}
      >
        <Grid2 size={{ xs: 12, lg: 10 }} sx={{ paddingBlock: '0', height: 1 }}>
          <Stack id="print-section">
            {!includeIhp
              ? snap.map((node) => <IhpTextFormat key={node.id} node={node} />)
              : withIhp.map((node) => (
                  <IhpTextFormat key={node.id} node={node} />
                ))}
          </Stack>
        </Grid2>
        <Grid2
          size={{ xs: 12, lg: 2 }}
          sx={{
            backgroundColor: '#323639',
            padding: '6rem 1.5rem',
            color: '#DCDCDC',
            height: '92vh',
          }}
        >
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Button onClick={downloadIhp} variant="contained" color="primary">
              Ladda ned Fastställd Arkivförteckning (JSON)
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                const printContents =
                  document.getElementById('print-section')?.innerHTML;
                if (printContents) {
                  const printWindow = window.open(
                    '',
                    '',
                    'height=600,width=800'
                  );
                  if (printWindow) {
                    const html = `
        <html>
          <head>
            <title>Skriv ut</title>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
                    printWindow.document.write(html);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                    printWindow.close();
                  }
                }
              }}
            >
              Skriv ut
            </Button>
            <Button
              variant={includeIhp ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setIncludeIHP(!includeIhp)}
            >
              {includeIhp ? 'Dölj alla fält' : 'Visa alla fält'}
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </ThemeProvider>
  );
};

export default KsReport;

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { OpenAPI } from 'Models/index';
import RestHeaders from 'Services/RestHeaders';
import { selectUserName } from 'Store/ducks/user/selectors';
import { useAppSelector } from 'Store/hooks';
import React, { useRef, useState } from 'react';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (importedCsnodeId: string) => void;
}

type ImportState = 'idle' | 'loading' | 'success' | 'error';

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ImportState>('idle');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const auth = useAppSelector(selectUserName);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setState('idle');
    setMessage('');
  };

  const handleImport = async () => {
    if (!file) return;
    setState('loading');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const base = OpenAPI.BASE || '';
      const response = await fetch(`${base}/rest/app/import/arkivforteckning`, {
        method: 'POST',
        headers: { auth: auth ?? '' },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setState('success');
        setMessage(result.message);
        if (result.importedCsnodeId) {
          onSuccess(result.importedCsnodeId);
        }
      } else {
        setState('error');
        setMessage(result.message || 'Import misslyckades.');
      }
    } catch (e) {
      setState('error');
      setMessage('Nätverksfel – kunde inte nå servern.');
    }
  };

  const handleClose = () => {
    setFile(null);
    setState('idle');
    setMessage('');
    if (fileRef.current) fileRef.current.value = '';
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Importera Arkivförteckning (JSON)</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">
            Välj en JSON-fil exporterad från Arkivförteckningsklienten
            (FaststalldArkivforteckning.json). Filen skapar en ny
            Arkivförteckning med hela strukturen.
          </Typography>

          <Button variant="outlined" component="label">
            {file ? file.name : 'Välj JSON-fil…'}
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {state === 'loading' && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="body2">Importerar…</Typography>
            </Stack>
          )}
          {state === 'success' && <Alert severity="success">{message}</Alert>}
          {state === 'error' && <Alert severity="error">{message}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Avbryt</Button>
        <Button
          variant="contained"
          disabled={!file || state === 'loading'}
          onClick={handleImport}
        >
          Importera
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportDialog;

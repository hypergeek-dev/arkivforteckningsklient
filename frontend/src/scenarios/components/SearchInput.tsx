import { ClearSharp, Search, Tune } from '@mui/icons-material';
import {
  ButtonBase,
  FormControl,
  InputAdornment,
  InputLabel,
  SxProps,
  TextField,
  Theme,
} from '@mui/material';
import * as React from 'react';

type SearchInputProps = {
  hideFilter?: boolean;
  filterOpen?: boolean;
  toggleFilter?: () => void;
  value: string;
  setValue: (v: string) => void;
  sx?: SxProps<Theme>;
  noToggle?: boolean;
  placeholder?: string;
};
export default function SearchInput({
  filterOpen,
  toggleFilter,
  value,
  setValue,
  hideFilter,
  sx,
  noToggle,
  placeholder,
}: Readonly<SearchInputProps>) {
  const [expand, setExpand] = React.useState(noToggle);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const toggle = () => {
    if (!noToggle) setExpand(!expand);
  };

  return (
    <FormControl sx={{ width: expand ? '50%' : '150px', ...sx }}>
      <InputLabel sx={{ display: 'none' }} htmlFor="search-input">
        Sök
      </InputLabel>
      <TextField
        placeholder={placeholder}
        inputProps={{ id: 'search-input', maxLength: 100 }}
        value={value}
        sx={{ width: '100%', maxWidth: '470px', margin: { lg: '0 auto' } }}
        size="small"
        variant="outlined"
        onFocus={() => {
          if (!noToggle) setExpand(true);
        }}
        onBlur={() => {
          if (!noToggle) setExpand(false);
        }}
        onChange={handleChange}
        InputProps={{
          sx: (theme) => ({
            borderRadius: '30px',
            bgcolor: theme.palette.background.paper,
          }),
          startAdornment: (
            <InputAdornment position="start">
              <ButtonBase
                onClick={() => {
                  if (!noToggle) toggle();
                }}
              >
                <Search />
              </ButtonBase>
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {value.length !== 0 && (
                <InputAdornment position="end">
                  <ButtonBase
                    aria-label="Rensa"
                    title="Rensa"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setValue('');
                    }}
                  >
                    <ClearSharp />
                  </ButtonBase>
                </InputAdornment>
              )}

              {hideFilter ? null : (
                <InputAdornment position="end">
                  <ButtonBase
                    aria-label="Visa filter"
                    title="Visa filter"
                    onClick={() => toggleFilter && toggleFilter()}
                  >
                    <Tune
                      color={filterOpen ? 'primary' : 'action'}
                      sx={{ ':hover': { cursor: 'pointer' } }}
                    />
                  </ButtonBase>
                </InputAdornment>
              )}
            </>
          ),
        }}
      />
    </FormControl>
  );
}

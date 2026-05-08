import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

interface SortSelectProps {
  selectedValues: { value: string; label: string }[];
  setSortOrder: (v: string) => void;
  selected: string;
}

export default function SortSelect({
  selectedValues,
  setSortOrder,
  selected,
}: Readonly<SortSelectProps>) {
  const handleChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 180 }}>
      <FormControl fullWidth>
        <InputLabel htmlFor="sort-select">Sortera</InputLabel>
        <Select
          inputProps={{ id: 'sort-select' }}
          value={selected}
          onChange={handleChange}
        >
          {selectedValues.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

import Label from '@mui/icons-material/Label';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { ElementDto } from 'Models/index';
import { NodeName } from 'Models/typed';
import React from 'react';
import { SelectListElementsButton } from 'Scenarios/elements/components/SelectListElements';

type Element = {
  id: string;
  nodeName: NodeName;
  list?: ElementDto[];
  disabled: boolean;
};
const EgnaElementCard = (props: Element) => {
  return (
    <Box>
      <Box height="280px" overflow="auto">
        <Typography variant="h5">Egna element</Typography>
        <List>
          {props.list
            ?.filter((e) => e.name !== 'Ej kategoriserad')
            .map((element) => (
              <ListItem
                key={element.id}
                sx={(theme) => ({
                  borderBottom: `1px solid ${theme.palette.divider}`,
                })}
              >
                <ListItemIcon>
                  <Label sx={{ transform: 'rotate(45deg)' }} />
                </ListItemIcon>
                <ListItemText primary={element.name} />
              </ListItem>
            ))}
        </List>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <SelectListElementsButton
          id={props.id}
          nodeName={props.nodeName}
          disabled={props.disabled}
        />
      </Box>
    </Box>
  );
};

export default EgnaElementCard;

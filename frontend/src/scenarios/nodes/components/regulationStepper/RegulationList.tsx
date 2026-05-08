/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from '@mui/material';
import { RuleDto } from 'Models/index';
import React from 'react';

interface RegulationListProps {
  items: RuleDto[];
  setSelectedRule: (id: number) => void;
  selected: number;
  disabled?: boolean;
}
const RegulationList: React.FC<RegulationListProps> = ({
  items,
  setSelectedRule,
  selected,
  disabled,
}) => {
  return (
    <List
      sx={{
        height: '200px',
        overflow: 'auto',
        width: '100%',
      }}
      dense
      component="div"
      role="list"
      key={`rulelist-${items.length}`}
    >
      {items.map((rule) => {
        const labelId = `transfer-list-item-${rule.name}-label`;

        return (
          <ListItemButton key={rule.uuid} role="listitem">
            <ListItemIcon>
              <Radio
                checked={selected === rule.id}
                title={`Välj denna regel, klicka därefter på pilknappen för att koppla regel.`}
                tabIndex={-1}
                value={rule.id}
                disabled={disabled}
                disableRipple
                onClick={(e: any) => {
                  const id = parseInt(e.target.value);
                  setSelectedRule(id);
                }}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={`${rule.description} ${
                rule.comment !== null ? rule.comment : ''
              }`}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
};
export default RegulationList;

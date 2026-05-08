import { ElementDto } from 'Models/index';
import { selectDatatypes } from 'Store/ducks/elements/selectors';
import { useAppSelector } from 'Store/hooks';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import ElementListItem from './ElementListItem';
import { useMediaQuery, useTheme } from '@mui/material';

interface ResultListProps {
  data: ElementDto[];
}

const ResultList: React.FC<ResultListProps> = ({ data }) => {
  const dataTypes = useAppSelector(selectDatatypes);
  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = data[index];
    return (
      <ElementListItem
        showExtraInfo
        datatypes={dataTypes}
        element={item}
        style={style}
      />
    );
  };

  return (
    <List
      style={{ marginBottom: '32px' }}
      width={'100%'}
      height={onlySmallScreen ? 500 : 650}
      itemCount={data.length}
      itemSize={110}
    >
      {({ index, style }) => <Row index={index} style={style} />}
    </List>
  );
};

export default React.memo(ResultList);

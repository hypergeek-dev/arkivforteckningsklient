import { RuleDto } from 'Models/index';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import RegulationIndexCard from './RegulationIndexCard';

interface ResultListProps {
  data: RuleDto[];
}

const ResultList: React.FC<ResultListProps> = ({ data }) => {
  const listHeight = window.innerHeight - 400;

  return (
    <List
      style={{ marginBottom: '32px' }}
      width={'100%'}
      height={listHeight}
      itemCount={data.length}
      itemSize={140}
    >
      {({ index, style }: { index: number; style: React.CSSProperties }) => (
        <Row index={index} style={style} data={data} />
      )}
    </List>
  );
};

export default React.memo(ResultList);

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: RuleDto[];
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const item = data[index];
  return (
    <RegulationIndexCard
      rule={item}
      key={`RuleListItem-${item.id}`}
      style={style}
    />
  );
};

import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { STANDARD_DATE_FORMAT } from 'Models/dataObjects';
import { NodeName, Status } from 'Models/typed';
import {
  selectFilterListwith,
  selectSearchDate,
} from 'Store/ducks/eventlogg/selectors';
import { useAppSelector } from 'Store/hooks';
import moment from 'moment';
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis } from 'recharts';

interface StatisticCardProps {
  label: string;
  onClick: (name: Status | NodeName) => void;
  sortType: Status | NodeName;
}

interface StatisticData {
  date: string;
  amt: number;
}

const StatisticCard = ({ sortType, label, onClick }: StatisticCardProps) => {
  const data = useAppSelector((state) => selectFilterListwith(state, sortType));
  const date = useAppSelector(selectSearchDate);
  const theme = useTheme();

  const length = moment(date.to)
    .add(1, 'day')
    .diff(moment(date.from).subtract(1, 'day'), 'days');
  const filledArray: StatisticData[] = [...Array(length)].map((v, i) => {
    const d = moment(date.from).add(i, 'days').format(STANDARD_DATE_FORMAT);
    return { date: d, amt: 0 };
  });

  const statisticData = data
    .map((item) => ({
      amt: 1,
      date: moment(item.created).format(STANDARD_DATE_FORMAT),
    }))
    .reduce((acc: StatisticData[], current) => {
      const sameDate = acc.find((m) => m.date === current.date);
      if (sameDate) {
        return [
          { amt: sameDate.amt + 1, date: sameDate.date },
          ...acc.filter((m) => m.date !== sameDate.date),
        ];
      }
      acc.push(current);
      return acc;
    }, []);

  const mergedStatistic = filledArray.map((s) => {
    const same = statisticData.find((st) => st.date === s.date);
    return same || s;
  });

  return (
    <Card elevation={5} sx={{ marginRight: 2 }}>
      <CardContent sx={{ width: '390px', height: '390px' }}>
        <Stack alignItems={'center'} width={1} spacing={2}>
          <Typography variant="h2">{label}</Typography>
          <Typography variant="h4">{data.length}</Typography>
          <LineChart
            width={380}
            height={200}
            data={mergedStatistic}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <XAxis dataKey="date" />
            <Line
              type="monotone"
              dataKey="amt"
              stroke={theme.palette.mode === 'light' ? '#82ca9d' : '#FFFFFF'}
            />
          </LineChart>

          <Button
            disabled={data.length === 0}
            variant="contained"
            onClick={() => onClick(sortType)}
          >
            Visa lista
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default React.memo(StatisticCard);

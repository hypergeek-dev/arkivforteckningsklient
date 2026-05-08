import { Button, Container, Grid2 } from '@mui/material';
import { RuleControllerService, RuleDto } from 'Models/index';
import BottomBar from 'Scenarios/components/BottomBar';
import { selectResponse } from 'Store/ducks/app/selectors';
import { actions } from 'Store/ducks/regulation';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';
import RegulationIndexCard from './components/RegulationIndexCard';
import RestHeaders from 'Services/RestHeaders';
import { selectUserName } from 'Store/ducks/user/selectors';

const ListRegulation = () => {
  const response = useAppSelector(selectResponse);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<RuleDto[]>();
  const auth = useAppSelector(selectUserName);

  useEffect(() => {
    fetchList(setData, auth);
  }, [response]);

  return (
    <Container maxWidth="sm">
      <Grid2 rowSpacing={2} container>
        {data?.map((rule) => <RegulationIndexCard key={rule.id} rule={rule} />)}
      </Grid2>
      <BottomBar>
        <Button
          onClick={() => {
            dispatch(actions.openDialog(true));
          }}
          color="primary"
          variant="contained"
          aria-label="Skapa"
        >
          + SKAPA GALLRINGSREGEL
        </Button>
      </BottomBar>
    </Container>
  );
};

async function fetchList(setData: (d: RuleDto[]) => void, auth: string) {
  const data = await RuleControllerService.fetchAllRules({
    ...RestHeaders.get,
    auth,
  });
  setData(data);
}
export default ListRegulation;

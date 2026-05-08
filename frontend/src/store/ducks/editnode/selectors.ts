import { createSelector } from '@reduxjs/toolkit';
import type { RootState as State } from '../../store';

export const nodeById = createSelector(
  [(state: State) => state.editNode, (state, nodeId: number) => nodeId],
  (data, nodeId) => data.structureNodes[nodeId]
);

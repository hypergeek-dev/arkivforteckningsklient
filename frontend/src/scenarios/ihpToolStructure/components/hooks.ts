import { NodeName, Status } from 'Models/typed';
import { actions } from 'Store/ducks/IHPToolStructure/reducer';
import {
  selectNodeNameFilter,
  selectSearchText,
  selectStatusFilter,
} from 'Store/ducks/IHPToolStructure/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import React, { useEffect, useState } from 'react';

/**
 * Hook for syncronizing state and router.
 * @param ksid
 * @param search
 * @param filter
 * @param status
 */
export const useFilterUrl = (
  ksid: string | undefined,
  search: string | undefined,
  filter: string | undefined,
  status: string | undefined
): void => {
  const dispatch = useAppDispatch();
  const StoreSearch = useAppSelector(selectSearchText);
  const storeNodeNameFilter = useAppSelector(selectNodeNameFilter);
  const storeStatus = useAppSelector(selectStatusFilter);

  React.useEffect(() => {
    if (filter || ksid || search || status) {
      const link = `${ksid ?? '$'}/${search ?? '$'}/${filter ?? '$'}/${
        status ?? '$'
      }`;

      if (search && search !== '$' && !StoreSearch) {
        dispatch(actions.setSearchText(search));
      }
      if (filter && filter !== '$' && storeNodeNameFilter.length === 0) {
        const nodeNameFilter = filter.split(',') as NodeName[];
        dispatch(actions.setNodeNamefilter(nodeNameFilter));
      }
      if (
        status &&
        status !== '$' &&
        status !== 'Alla' &&
        storeStatus !== 'Alla'
      ) {
        dispatch(actions.setStatusFilter(status as Status));
      }
      dispatch(actions.setselectionLink(link));
    }
  }, []);
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

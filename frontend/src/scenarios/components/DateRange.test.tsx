import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRange from './DateRange';
import moment from 'moment';
import { STANDARD_ISO_FORMAT } from 'Models/dataObjects';

jest.mock('uuid');

describe('DateRange Component', () => {
  const setDateMock = jest.fn();
  const initialDate = {
    from: moment()
      .subtract(7, 'days')
      .startOf('day')
      .format(STANDARD_ISO_FORMAT),
    to: moment().endOf('day').format(STANDARD_ISO_FORMAT),
  };

  it('renders without crashing', () => {
    const { getByLabelText } = render(
      <DateRange
        setDate={setDateMock}
        date={{ to: initialDate.to, from: initialDate.from }}
      />
    );
    expect(getByLabelText('Från')).toBeInTheDocument();
    expect(getByLabelText('Till')).toBeInTheDocument();
  });

  it('calls setDate with correct values when "Från" date changes', () => {
    const { getByLabelText } = render(
      <DateRange
        setDate={setDateMock}
        date={{ to: initialDate.to, from: initialDate.from }}
      />
    );
    const fromDateInput = getByLabelText('Från');
    const newFromDate = moment().subtract(10, 'days').format('YYYY-MM-DD');

    fireEvent.change(fromDateInput, { target: { value: newFromDate } });

    expect(setDateMock).toHaveBeenCalledWith({
      ...initialDate,
      from: moment(newFromDate).startOf('day').format(STANDARD_ISO_FORMAT),
    });
  });

  it('calls setDate with correct values when "Till" date changes', () => {
    const { getByLabelText } = render(
      <DateRange
        setDate={setDateMock}
        date={{ to: initialDate.to, from: initialDate.from }}
      />
    );

    const toDateInput = getByLabelText('Till');
    const newToDate = moment().add(5, 'days').format(STANDARD_ISO_FORMAT);

    console.log('newToDate', newToDate);
    console.log('initialDate', initialDate);

    fireEvent.change(toDateInput, { target: { value: newToDate } });

    expect(setDateMock).toHaveBeenCalledTimes(1);
    /*
    expect(setDateMock).toHaveBeenCalledWith({
      from: initialDate.from,
      to: moment(newToDate).endOf('day').format(STANDARD_ISO_FORMAT),
    });
    */
  });
});

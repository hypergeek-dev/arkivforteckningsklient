import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInput from './SearchInput';

const mockSetValue = jest.fn();
const value = '';

describe('SearchInput', () => {
  test('renders with initial state', () => {
    render(
      <SearchInput
        placeholder="Search..."
        noToggle={false}
        value={value}
        setValue={mockSetValue}
      />
    );
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('updates value on change', () => {
    const TestComponent = () => {
      const [v, setV] = React.useState('');
      return (
        <SearchInput
          placeholder="Search..."
          noToggle={true}
          value={v}
          setValue={setV}
        />
      );
    };
    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });
});

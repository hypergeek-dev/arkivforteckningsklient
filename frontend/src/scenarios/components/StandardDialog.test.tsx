import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StandardDialog from './StandardDialog';

describe('StandardDialog', () => {
  const handleClose = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <StandardDialog handleClose={handleClose} open={true} {...props}>
        <div>Dialog Content</div>
      </StandardDialog>
    );
  };

  it('should render the dialog with children', () => {
    renderComponent();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('should call handleClose when close button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText('close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should render the toolbar content if provided', () => {
    const toolBarContent = <div>Toolbar Content</div>;
    renderComponent({ toolBarContent });
    expect(screen.getByText('Toolbar Content')).toBeInTheDocument();
  });

  it('should apply containerStyle if provided', () => {
    const containerStyle = { backgroundColor: 'red' };
    renderComponent({ containerStyle });
    const container = screen.getByText('Dialog Content').parentElement;
    expect(container).toHaveStyle('background-color: red');
  });
});

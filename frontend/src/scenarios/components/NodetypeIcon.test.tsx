import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NodetypeIcon from './NodetypeIcon';

const icons = {
  csnode: 'DeviceHubIcon',
  oanode: 'CircleIcon',
  pgnode: 'WorkspacesIcon',
  processnode: 'TimelineIcon',
  issuenode: 'FolderOpenOutlinedIcon',
  documentnode: 'DescriptionOutlinedIcon',
};

describe('NodetypeIcon', () => {
  test('renders csnode icon', () => {
    render(<NodetypeIcon nodeName="csnode" />);
    expect(screen.getByTestId(icons.csnode)).toBeInTheDocument();
  });

  test('renders oanode icon', () => {
    render(<NodetypeIcon nodeName="oanode" />);
    expect(screen.getByTestId(icons.oanode)).toBeInTheDocument();
  });

  test('renders pgnode icon', () => {
    render(<NodetypeIcon nodeName="pgnode" />);
    expect(screen.getByTestId(icons.pgnode)).toBeInTheDocument();
  });

  test('renders processnode icon', () => {
    render(<NodetypeIcon nodeName="processnode" />);
    expect(screen.getByTestId(icons.processnode)).toBeInTheDocument();
  });

  test('renders issuenode icon', () => {
    render(<NodetypeIcon nodeName="issuenode" />);
    expect(screen.getByTestId(icons.issuenode)).toBeInTheDocument();
  });

  test('renders documentnode icon', () => {
    render(<NodetypeIcon nodeName="documentnode" />);
    expect(screen.getByTestId(icons.documentnode)).toBeInTheDocument();
  });
});

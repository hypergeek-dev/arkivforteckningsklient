import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { nodeTypeMapper } from 'Common/helper';
import { NodeName } from 'Models/typed';
import React from 'react';
import AvatarNode from './AvatarNode';

describe('AvatarNode', () => {
  const nodeName: NodeName = 'documentnode';

  it('renders with default size', () => {
    const { getByText } = render(<AvatarNode nodeName={nodeName} />);
    const avatarText = getByText(nodeTypeMapper(nodeName).avatarText);
    expect(avatarText).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { getByText } = render(
      <AvatarNode nodeName={nodeName} size="small" />
    );
    const avatarText = getByText(nodeTypeMapper(nodeName).avatarText);
    expect(avatarText).toBeInTheDocument();
  });

  it('renders with large size', () => {
    const { getByText } = render(
      <AvatarNode nodeName={nodeName} size="large" />
    );
    const avatarText = getByText(nodeTypeMapper(nodeName).avatarText);
    expect(avatarText).toBeInTheDocument();
  });

  it('renders with xlarge size', () => {
    const { getByText } = render(
      <AvatarNode nodeName={nodeName} size="xlarge" />
    );
    const avatarText = getByText(nodeTypeMapper(nodeName).avatarText);
    expect(avatarText).toBeInTheDocument();
  });
});

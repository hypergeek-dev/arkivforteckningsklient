import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentList from './CommentList';
import { NodeTypeCommentDto } from 'Models/index';

describe('CommentList', () => {
  const comments: NodeTypeCommentDto[] = [
    {
      id: 1,
      createdBy: 'User1',
      createdAt: '2022-11-28T12:43:02',
      comment: 'This is a comment by User1',
    },
    {
      id: 2,
      createdBy: 'User2',
      createdAt: '2022-11-29T14:23:45',
      comment: 'This is a comment by User2',
    },
  ];

  it('renders without crashing', () => {
    render(<CommentList comments={comments} />);
  });

  it('renders the correct number of comments', () => {
    const { getAllByText } = render(<CommentList comments={comments} />);
    expect(getAllByText(/This is a comment by/).length).toBe(2);
  });

  it('renders the correct content for each comment', () => {
    const { getByText } = render(<CommentList comments={comments} />);
    expect(getByText('This is a comment by User1')).toBeInTheDocument();
    expect(getByText('This is a comment by User2')).toBeInTheDocument();
  });

  it('renders nothing when there are no comments', () => {
    const { container } = render(<CommentList comments={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommentElem from './CommentElem';
import habitService from '../services/habitService';
import TrashIcon from './icons/TrashIcon';

jest.mock('../services/habitService');
jest.mock('./icons/TrashIcon', () => (props) => <div data-testid="trash-icon" {...props}>TrashIcon</div>);

describe('CommentElem', () => {
  const mockNoteId = '1';
  const mockComments = {
    comment: [{
      comments: [
        { name: 'User1', date: '2023-01-01', comment: 'Test comment 1', commentId: '1' },
        { name: 'User2', date: '2023-01-02', comment: 'Test comment 2', commentId: '2' }
      ]
    }],
    currUserName: 'User1'
  };

  beforeEach(() => {
    habitService.getComments.mockResolvedValue({ ok: true, json: async () => mockComments });
    habitService.comment.mockResolvedValue({ ok: true, json: async () => ({}) });
    habitService.deleteComment.mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the load comments button', () => {
    render(<CommentElem noteId={mockNoteId} />);
    expect(screen.getByText('load Comments')).toBeInTheDocument();
  });

  it('should load and display comments when clicking "load Comments"', async () => {
    render(<CommentElem noteId={mockNoteId} />);
    fireEvent.click(screen.getByText('load Comments'));

    await waitFor(() => {
      expect(screen.getByText('Hide comments')).toBeInTheDocument();
      expect(screen.getByText('Test comment 1')).toBeInTheDocument();
      expect(screen.getByText('Test comment 2')).toBeInTheDocument();
    });
  });

  it('should hide comments when clicking "Hide comments"', async () => {
    render(<CommentElem noteId={mockNoteId} />);
    fireEvent.click(screen.getByText('load Comments'));

    await waitFor(() => screen.getByText('Hide comments'));
    fireEvent.click(screen.getByText('Hide comments'));

    await waitFor(() => {
      expect(screen.getByText('load Comments')).toBeInTheDocument();
      expect(screen.queryByText('Test comment 1')).not.toBeInTheDocument();
    });
  });

  it('should submit a new comment', async () => {
    render(<CommentElem noteId={mockNoteId} />);
    fireEvent.click(screen.getByText('load Comments'));

    await waitFor(() => screen.getByText('Hide comments'));

    const input = screen.getByPlaceholderText('Type a comment...');
    fireEvent.change(input, { target: { value: 'New Comment' } });

    const submitButton = screen.getByText('submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(habitService.comment).toHaveBeenCalledWith('New Comment', mockNoteId, undefined);
      expect(habitService.getComments).toHaveBeenCalledTimes(2); // Initial load and after submit
    });
  });

  it('should delete a comment', async () => {
    render(<CommentElem noteId={mockNoteId} />);
    fireEvent.click(screen.getByText('load Comments'));

    await waitFor(() => screen.getByText('Hide comments'));

    const trashIcon = screen.getAllByTestId('trash-icon')[0];
    fireEvent.click(trashIcon);

    await waitFor(() => {
      expect(habitService.deleteComment).toHaveBeenCalledWith('1', mockNoteId);
      expect(habitService.getComments).toHaveBeenCalledTimes(2); // Initial load and after delete
    });
  });
});

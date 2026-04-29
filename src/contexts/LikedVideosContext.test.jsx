import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LikedVideosProvider, useLikedVideos } from './LikedVideosContext';
import { useAuth } from './AuthContext';
import { userDataAPI } from '../utils/api';

vi.mock('./AuthContext', () => ({
    useAuth: vi.fn()
}));

vi.mock('../utils/api', () => ({
    userDataAPI: {
        getUserData: vi.fn(),
        addToLikedVideos: vi.fn(),
        removeFromLikedVideos: vi.fn()
    }
}));

const TestComponent = () => {
    const { likedVideos, addToLikedVideos } = useLikedVideos();
    return (
        <div>
            <div data-testid="count">{likedVideos.length}</div>
            <button onClick={() => addToLikedVideos({ id: { videoId: 'video1' }, title: 'Test Video' })}>
                Add Video
            </button>
        </div>
    );
};

describe('LikedVideosContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('reverts optimistic update when addToLikedVideos fails', async () => {
        // Mock user as logged in
        useAuth.mockReturnValue({ user: { id: 'user1' } });

        // Mock getUserData to return empty initial list
        userDataAPI.getUserData.mockResolvedValue({ likedVideos: [] });

        // Mock addToLikedVideos to return a delayed rejection
        let rejectPromise;
        const addPromise = new Promise((_, reject) => {
            rejectPromise = reject;
        });
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        userDataAPI.addToLikedVideos.mockReturnValue(addPromise);

        render(
            <LikedVideosProvider>
                <TestComponent />
            </LikedVideosProvider>
        );

        // Initial count should be 0
        expect(screen.getByTestId('count')).toHaveTextContent('0');

        // Click add button
        const user = userEvent.setup();
        await user.click(screen.getByText('Add Video'));

        // It should optimistically update to 1
        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('1');
        });

        // Reject the promise to simulate network error
        act(() => {
            rejectPromise(new Error('Network error'));
        });

        // It should revert back to 0
        await waitFor(() => {
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });

        expect(userDataAPI.addToLikedVideos).toHaveBeenCalledWith(expect.objectContaining({
            id: { videoId: 'video1' },
            title: 'Test Video'
        }));

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to liked videos:', expect.any(Error));

        consoleErrorSpy.mockRestore();
    });
});

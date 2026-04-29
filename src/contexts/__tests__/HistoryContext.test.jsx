import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { HistoryProvider, useHistory } from '../HistoryContext';
import { useAuth } from '../AuthContext';
import { userDataAPI } from '../../utils/api';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../AuthContext', () => ({
    useAuth: vi.fn()
}));

vi.mock('../../utils/api', () => ({
    userDataAPI: {
        getUserData: vi.fn(),
        addToHistory: vi.fn(),
        removeFromHistory: vi.fn(),
        clearHistory: vi.fn()
    }
}));

describe('HistoryContext', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Setup default mock implementation
        userDataAPI.getUserData.mockResolvedValue({ history: [] });
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    const TestComponent = () => {
        const { historyItems, addToHistory, removeFromHistory, clearHistory, loading } = useHistory();
        return (
            <div>
                <div data-testid="loading">{loading.toString()}</div>
                <div data-testid="items-count">{historyItems.length}</div>
                <button
                    data-testid="add-btn"
                    onClick={() => addToHistory({ id: 'video1', title: 'Test Video', thumbnail: 'thumb.jpg', channelTitle: 'Test Channel' })}
                >
                    Add
                </button>
                <button
                    data-testid="remove-btn"
                    onClick={() => removeFromHistory('video1')}
                >
                    Remove
                </button>
                <button
                    data-testid="clear-btn"
                    onClick={() => clearHistory()}
                >
                    Clear
                </button>
            </div>
        );
    };

    it('reverts optimistic update when addToHistory API fails', async () => {
        // Setup user as logged in so API calls are made
        useAuth.mockReturnValue({ user: { id: 'user1' } });

        // Mock API to reject
        userDataAPI.addToHistory.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(
            <HistoryProvider>
                <TestComponent />
            </HistoryProvider>
        );

        // Wait for initial load
        await waitFor(() => {
            expect(getByTestId('loading').textContent).toBe('false');
        });

        // Click add button
        act(() => {
            getByTestId('add-btn').click();
        });

        // Initially it should be optimistically updated to 1
        expect(getByTestId('items-count').textContent).toBe('1');

        // Wait for API call to fail and revert
        await waitFor(() => {
            expect(userDataAPI.addToHistory).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(getByTestId('items-count').textContent).toBe('0');
        });

        // Should catch the error
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding to history:', expect.any(Error));
    });

    it('adds to history optimistically when API succeeds', async () => {
        useAuth.mockReturnValue({ user: { id: 'user1' } });
        userDataAPI.addToHistory.mockResolvedValueOnce({});

        const { getByTestId } = render(
            <HistoryProvider>
                <TestComponent />
            </HistoryProvider>
        );

        await waitFor(() => {
            expect(getByTestId('loading').textContent).toBe('false');
        });

        act(() => {
            getByTestId('add-btn').click();
        });

        expect(getByTestId('items-count').textContent).toBe('1');

        await waitFor(() => {
            expect(userDataAPI.addToHistory).toHaveBeenCalledTimes(1);
        });

        // Still 1 after success
        expect(getByTestId('items-count').textContent).toBe('1');
    });

    it('reverts optimistic update when removeFromHistory API fails', async () => {
        useAuth.mockReturnValue({ user: { id: 'user1' } });

        // Start with an item in history
        userDataAPI.getUserData.mockResolvedValueOnce({
            history: [{ id: 'video1', title: 'Test Video' }]
        });
        userDataAPI.removeFromHistory.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(
            <HistoryProvider>
                <TestComponent />
            </HistoryProvider>
        );

        await waitFor(() => {
            expect(getByTestId('loading').textContent).toBe('false');
            expect(getByTestId('items-count').textContent).toBe('1');
        });

        act(() => {
            getByTestId('remove-btn').click();
        });

        // Optimistically removed
        expect(getByTestId('items-count').textContent).toBe('0');

        // Wait for revert
        await waitFor(() => {
            expect(userDataAPI.removeFromHistory).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(getByTestId('items-count').textContent).toBe('1');
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing from history:', expect.any(Error));
    });

    it('reverts optimistic update when clearHistory API fails', async () => {
        useAuth.mockReturnValue({ user: { id: 'user1' } });

        // Start with items in history
        userDataAPI.getUserData.mockResolvedValueOnce({
            history: [{ id: 'video1', title: 'Test Video' }, { id: 'video2', title: 'Test Video 2' }]
        });
        userDataAPI.clearHistory.mockRejectedValueOnce(new Error('API Error'));

        const { getByTestId } = render(
            <HistoryProvider>
                <TestComponent />
            </HistoryProvider>
        );

        await waitFor(() => {
            expect(getByTestId('loading').textContent).toBe('false');
            expect(getByTestId('items-count').textContent).toBe('2');
        });

        act(() => {
            getByTestId('clear-btn').click();
        });

        // Optimistically cleared
        expect(getByTestId('items-count').textContent).toBe('0');

        // Wait for revert
        await waitFor(() => {
            expect(userDataAPI.clearHistory).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(getByTestId('items-count').textContent).toBe('2');
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error clearing history:', expect.any(Error));
    });
});

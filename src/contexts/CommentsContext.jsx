import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { userDataAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CommentsContext = createContext();

export const useComments = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('useComments must be used within a CommentsProvider');
    }
    return context;
};

export const CommentsProvider = ({ children }) => {
    const [commentsByVideo, setCommentsByVideo] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Fetch comments for a specific video
    const fetchComments = async (videoId) => {
        if (!videoId) return;
        
        setLoading(prev => ({ ...prev, [videoId]: true }));
        setError(null);
        
        try {
            const data = await userDataAPI.getComments(videoId);
            setCommentsByVideo(prev => ({
                ...prev,
                [videoId]: data.comments || []
            }));
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments');
            setCommentsByVideo(prev => ({
                ...prev,
                [videoId]: []
            }));
        } finally {
            setLoading(prev => ({ ...prev, [videoId]: false }));
        }
    };

    // Add a new comment
    const addComment = async (videoId, text, parentCommentId = null) => {
        if (!user) {
            setError('Please login to comment');
            return;
        }

        try {
            const data = await userDataAPI.addComment(videoId, text, parentCommentId);
            
            // Optimistically update UI
            setCommentsByVideo(prev => {
                const videoComments = prev[videoId] || [];
                
                if (parentCommentId) {
                    // Add as a reply
                    return {
                        ...prev,
                        [videoId]: videoComments.map(comment => 
                            comment.id === parentCommentId || comment._id === parentCommentId
                                ? { 
                                    ...comment, 
                                    replies: [...(comment.replies || []), data.comment] 
                                }
                                : comment
                        )
                    };
                } else {
                    // Add as top-level comment
                    return {
                        ...prev,
                        [videoId]: [{ ...data.comment, replies: [] }, ...videoComments]
                    };
                }
            });
            
            return data.comment;
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.response?.data?.error || 'Failed to add comment');
            throw err;
        }
    };

    // Update a comment
    const updateComment = async (videoId, commentId, text) => {
        if (!user) {
            setError('Please login to edit comments');
            return;
        }

        try {
            const data = await userDataAPI.updateComment(commentId, text);
            
            // Update comment in state
            setCommentsByVideo(prev => {
                const videoComments = prev[videoId] || [];
                return {
                    ...prev,
                    [videoId]: videoComments.map(comment => {
                        // Update top-level comment
                        if (comment.id === commentId || comment._id === commentId) {
                            return { ...comment, ...data.comment };
                        }
                        // Update reply
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply =>
                                    reply.id === commentId || reply._id === commentId
                                        ? { ...reply, ...data.comment }
                                        : reply
                                )
                            };
                        }
                        return comment;
                    })
                };
            });
            
            return data.comment;
        } catch (err) {
            console.error('Error updating comment:', err);
            setError(err.response?.data?.error || 'Failed to update comment');
            throw err;
        }
    };

    // Delete a comment
    const deleteComment = async (videoId, commentId) => {
        if (!user) {
            setError('Please login to delete comments');
            return;
        }

        try {
            await userDataAPI.deleteComment(commentId);
            
            // Remove comment from state
            setCommentsByVideo(prev => {
                const videoComments = prev[videoId] || [];
                return {
                    ...prev,
                    [videoId]: videoComments
                        .filter(comment => comment.id !== commentId && comment._id !== commentId)
                        .map(comment => ({
                            ...comment,
                            replies: (comment.replies || []).filter(
                                reply => reply.id !== commentId && reply._id !== commentId
                            )
                        }))
                };
            });
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.response?.data?.error || 'Failed to delete comment');
            throw err;
        }
    };

    // Like a comment
    const likeComment = async (videoId, commentId) => {
        if (!user) {
            setError('Please login to like comments');
            return;
        }

        try {
            const data = await userDataAPI.likeComment(commentId);
            
            // Update likes count in state
            setCommentsByVideo(prev => {
                const videoComments = prev[videoId] || [];
                return {
                    ...prev,
                    [videoId]: videoComments.map(comment => {
                        if (comment.id === commentId || comment._id === commentId) {
                            return { 
                                ...comment, 
                                likes: new Array(data.likesCount).fill(null),
                                dislikes: new Array(data.dislikesCount).fill(null)
                            };
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply =>
                                    reply.id === commentId || reply._id === commentId
                                        ? { 
                                            ...reply, 
                                            likes: new Array(data.likesCount).fill(null),
                                            dislikes: new Array(data.dislikesCount).fill(null)
                                        }
                                        : reply
                                )
                            };
                        }
                        return comment;
                    })
                };
            });
            
            return data;
        } catch (err) {
            console.error('Error liking comment:', err);
            setError(err.response?.data?.error || 'Failed to like comment');
            throw err;
        }
    };

    // Dislike a comment
    const dislikeComment = async (videoId, commentId) => {
        if (!user) {
            setError('Please login to dislike comments');
            return;
        }

        try {
            const data = await userDataAPI.dislikeComment(commentId);
            
            // Update dislikes count in state
            setCommentsByVideo(prev => {
                const videoComments = prev[videoId] || [];
                return {
                    ...prev,
                    [videoId]: videoComments.map(comment => {
                        if (comment.id === commentId || comment._id === commentId) {
                            return { 
                                ...comment, 
                                likes: new Array(data.likesCount).fill(null),
                                dislikes: new Array(data.dislikesCount).fill(null)
                            };
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply =>
                                    reply.id === commentId || reply._id === commentId
                                        ? { 
                                            ...reply, 
                                            likes: new Array(data.likesCount).fill(null),
                                            dislikes: new Array(data.dislikesCount).fill(null)
                                        }
                                        : reply
                                )
                            };
                        }
                        return comment;
                    })
                };
            });
            
            return data;
        } catch (err) {
            console.error('Error disliking comment:', err);
            setError(err.response?.data?.error || 'Failed to dislike comment');
            throw err;
        }
    };

    const value = {
        commentsByVideo,
        loading,
        error,
        fetchComments,
        addComment,
        updateComment,
        deleteComment,
        likeComment,
        dislikeComment
    };

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
};

CommentsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

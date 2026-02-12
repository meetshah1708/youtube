import { useState, useEffect, useCallback } from "react";
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Avatar, 
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Collapse,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import PropTypes from "prop-types";
import { useComments } from '../contexts/CommentsContext';
import { useAuth } from '../contexts/AuthContext';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';

// Helper function to format time ago
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    
    return Math.floor(seconds) + " second" + (Math.floor(seconds) !== 1 ? "s" : "") + " ago";
};

// Individual Comment Component
function CommentItem({ comment, videoId, isReply = false }) {
    const { user } = useAuth();
    const { updateComment, deleteComment, likeComment, dislikeComment, addComment, error: contextError } = useComments();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const isOwner = user && comment.userId === user.id;
    const likesCount = comment.likesCount || comment.likes?.length || 0;
    const dislikesCount = comment.dislikesCount || comment.dislikes?.length || 0;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
        handleMenuClose();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(comment.text);
    };

    const handleSaveEdit = async () => {
        if (!editText.trim()) return;
        
        try {
            setActionLoading(true);
            await updateComment(videoId, comment.id || comment._id, editText);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update comment:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const confirmDelete = async () => {
        try {
            setActionLoading(true);
            await deleteComment(videoId, comment.id || comment._id);
            setDeleteDialogOpen(false);
        } catch (err) {
            console.error('Failed to delete comment:', err);
        } finally {
            setActionLoading(false);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const handleLike = async () => {
        if (!user) {
            setLocalError('Please login to like comments');
            return;
        }
        setLocalError(null);
        try {
            await likeComment(videoId, comment.id || comment._id);
        } catch (err) {
            console.error('Failed to like comment:', err);
        }
    };

    const handleDislike = async () => {
        if (!user) {
            setLocalError('Please login to dislike comments');
            return;
        }
        setLocalError(null);
        try {
            await dislikeComment(videoId, comment.id || comment._id);
        } catch (err) {
            console.error('Failed to dislike comment:', err);
        }
    };

    const handleReply = () => {
        if (!user) {
            setLocalError('Please login to reply');
            return;
        }
        setLocalError(null);
        setShowReplyBox(!showReplyBox);
    };

    const handlePostReply = async () => {
        if (!replyText.trim()) return;
        
        try {
            setActionLoading(true);
            await addComment(videoId, replyText, comment.id || comment._id);
            setReplyText("");
            setShowReplyBox(false);
        } catch (err) {
            console.error('Failed to post reply:', err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Box mb={2} ml={isReply ? 4 : 0}>
            {(localError || contextError) && (
                <Alert severity="warning" sx={{ mb: 1 }} onClose={() => setLocalError(null)}>
                    {localError || contextError}
                </Alert>
            )}
            <Box display="flex" alignItems="flex-start">
                <Avatar sx={{ bgcolor: '#fc1503', mr: 1.5 }}>
                    {comment.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box flex={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" color="#fff" fontWeight="bold">
                                {comment.username}
                                <Typography 
                                    component="span" 
                                    variant="caption" 
                                    color="gray" 
                                    ml={1}
                                >
                                    {timeAgo(comment.createdAt)}
                                    {comment.isEdited && " (edited)"}
                                </Typography>
                            </Typography>
                        </Box>
                        {isOwner && (
                            <IconButton 
                                size="small" 
                                onClick={handleMenuOpen}
                                sx={{ color: 'gray' }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    {isEditing ? (
                        <Box mt={1}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    bgcolor: '#2a2a2a',
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                    }
                                }}
                            />
                            <Box mt={1} display="flex" gap={1}>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    onClick={handleSaveEdit}
                                    disabled={actionLoading}
                                >
                                    Save
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    onClick={handleCancelEdit}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="#fff" mt={0.5}>
                            {comment.text}
                        </Typography>
                    )}

                    {!isEditing && (
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <IconButton 
                                size="small" 
                                onClick={handleLike}
                                sx={{ color: 'gray' }}
                            >
                                {likesCount > 0 ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                            </IconButton>
                            <Typography variant="caption" color="gray">
                                {likesCount}
                            </Typography>
                            
                            <IconButton 
                                size="small" 
                                onClick={handleDislike}
                                sx={{ color: 'gray', ml: 1 }}
                            >
                                {dislikesCount > 0 ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                            </IconButton>
                            <Typography variant="caption" color="gray">
                                {dislikesCount}
                            </Typography>

                            {!isReply && (
                                <Button
                                    size="small"
                                    startIcon={<ReplyIcon />}
                                    onClick={handleReply}
                                    sx={{ 
                                        color: 'gray', 
                                        ml: 1,
                                        textTransform: 'none'
                                    }}
                                >
                                    Reply
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Reply Box */}
                    <Collapse in={showReplyBox}>
                        <Box mt={2} display="flex" gap={1}>
                            <Avatar sx={{ bgcolor: '#fc1503', width: 32, height: 32 }}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box flex={1}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    placeholder="Add a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        bgcolor: '#2a2a2a',
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                        }
                                    }}
                                />
                                <Box mt={1} display="flex" gap={1}>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={handlePostReply}
                                        disabled={!replyText.trim() || actionLoading}
                                    >
                                        Reply
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        onClick={() => {
                                            setShowReplyBox(false);
                                            setReplyText("");
                                        }}
                                        disabled={actionLoading}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <Box mt={2}>
                            {comment.replies.map(reply => (
                                <CommentItem 
                                    key={reply.id || reply._id} 
                                    comment={reply} 
                                    videoId={videoId}
                                    isReply={true}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Menu for edit/delete */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDelete}
                PaperProps={{
                    sx: {
                        bgcolor: '#2a2a2a',
                        color: '#fff'
                    }
                }}
            >
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#ccc' }}>
                        Are you sure you want to delete this comment? This action cannot be undone.
                        {comment.replies && comment.replies.length > 0 && (
                            <Box component="span" display="block" mt={1} color="warning.main">
                                This will also delete {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}.
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} disabled={actionLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDelete} 
                        color="error" 
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    videoId: PropTypes.string.isRequired,
    isReply: PropTypes.bool
};

// Main Comments Component
export default function Comments({ videoId }) {
    const { user } = useAuth();
    const { commentsByVideo, loading, error, fetchComments, addComment } = useComments();
    const [newComment, setNewComment] = useState("");
    const [postLoading, setPostLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    const comments = commentsByVideo[videoId] || [];
    const isLoading = loading[videoId];

    const loadComments = useCallback(() => {
        if (videoId) {
            fetchComments(videoId);
        }
    }, [videoId, fetchComments]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        if (!user) {
            setLocalError('Please login to comment');
            return;
        }
        setLocalError(null);

        try {
            setPostLoading(true);
            await addComment(videoId, newComment);
            setNewComment("");
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setPostLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    return (
        <Box mt={4} bgcolor="#1e1e1e" p={3} borderRadius={2}>
            <Typography variant="h6" color="#fff" mb={3}>
                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </Typography>

            {(error || localError) && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLocalError(null)}>
                    {localError || error}
                </Alert>
            )}

            {/* Add Comment Box */}
            <Box display="flex" gap={1.5} mb={4}>
                <Avatar sx={{ bgcolor: '#fc1503' }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box flex={1}>
                    <TextField
                        variant="outlined"
                        placeholder={user ? "Add a comment..." : "Login to add a comment"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        fullWidth
                        multiline
                        minRows={2}
                        disabled={!user || postLoading}
                        sx={{
                            bgcolor: '#2a2a2a',
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                            }
                        }}
                    />
                    <Box mt={1} display="flex" justifyContent="flex-end" gap={1}>
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => setNewComment("")}
                            disabled={!newComment.trim() || postLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || !user || postLoading}
                        >
                            {postLoading ? <CircularProgress size={20} /> : 'Comment'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ bgcolor: '#3a3a3a', mb: 3 }} />

            {/* Comments List */}
            {isLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            ) : comments.length === 0 ? (
                <Typography variant="body2" color="gray" textAlign="center" py={4}>
                    No comments yet. Be the first to comment!
                </Typography>
            ) : (
                comments.map(comment => (
                    <CommentItem 
                        key={comment.id || comment._id} 
                        comment={comment} 
                        videoId={videoId}
                    />
                ))
            )}
        </Box>
    );
}

Comments.propTypes = {
    videoId: PropTypes.string.isRequired,
}; 
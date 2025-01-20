import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import PropTypes from "prop-types";

export default function Comments({ videoId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        // Fetch comments from an API or use mock data
        // For demonstration, using mock data
        const mockComments = [
            { id: 1, user: "John Doe", text: "Great video!" },
            { id: 2, user: "Jane Smith", text: "Very informative." },
        ];
        setComments(mockComments);
    }, [videoId]);

    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        const comment = {
            id: comments.length + 1,
            user: "You",
            text: newComment,
        };
        setComments([...comments, comment]);
        setNewComment("");
    };

    return (
        <Box mt={4} bgcolor="#1e1e1e" p={2} borderRadius={2}>
            <Typography variant="h6" color="#fff" mb={2}>
                Comments
            </Typography>
            {comments.map(comment => (
                <Box key={comment.id} display="flex" mb={2}>
                    <Avatar>{comment.user.charAt(0)}</Avatar>
                    <Box ml={2}>
                        <Typography variant="subtitle2" color="#fff">{comment.user}</Typography>
                        <Typography variant="body2" color="gray">{comment.text}</Typography>
                    </Box>
                </Box>
            ))}
            <Box display="flex" mt={2}>
                <TextField
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    fullWidth
                    sx={{
                        bgcolor: "#1e1e1e",
                        borderRadius: 1,
                        mr: 2,
                    }}
                />
                <Button variant="contained" color="secondary" onClick={handleAddComment}>
                    Post
                </Button>
            </Box>
        </Box>
    );
}

Comments.propTypes = {
    videoId: PropTypes.string.isRequired,
}; 
// Create web server
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');



const app = express();
const port = 3000;

app.use(bodyParser.json());

// Read comments from comments.json
const commentsData = fs.readFileSync('comments.json');
let comments = JSON.parse(commentsData);

// GET /comments - returns a list of comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// POST /comments - creates a new comment
app.post('/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = comments.length + 1;
    comments.push(newComment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.status(201).json(newComment);
});

// PUT /comments/:id - updates a comment
app.put('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const updatedComment = req.body;
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
        comments[commentIndex] = { ...comments[commentIndex], ...updatedComment };
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        res.json(comments[commentIndex]);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

// DELETE /comments/:id - deletes a comment
app.delete('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    if (commentIndex !== -1) {
        const deletedComment = comments.splice(commentIndex, 1)[0];
        fs.writeFileSync('comments.json', JSON.stringify(comments));
        res.json(deletedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
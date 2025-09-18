const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // A valid username is a non-empty string and NOT already registered
  if (!username || typeof username !== 'string') return false;
  return !users.some(u => u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(u => u.username === username && u.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: 'Username and password are required'});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: 'Invalid username or password'});
  }

  const accessToken = jwt.sign({username: username}, 'access', { expiresIn: '1h' });
  req.session.authorization = {
    accessToken,
    username
  }
  return res.status(200).json({message: 'User successfully logged in'});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user || (req.session && req.session.authorization && req.session.authorization.username);
  const isbn = req.params.isbn;
  const {review} = req.body;

  if (!username) {
    return res.status(403).json({message: 'You must be logged in to add a review'});
  }
  if (!isbn || !books[isbn]) {
    return res.status(404).json({message: 'Book not found'});
  }
  if (!review) {
    return res.status(400).json({message: 'Review text is required'});
  }

  // Add or update review for this user
  books[isbn].reviews[username] = review;

  return res.status(200).json({message: 'Review added/updated successfully', reviews: books[isbn].reviews});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user || (req.session && req.session.authorization && req.session.authorization.username);
  const isbn = req.params.isbn;

  if (!username) {
    return res.status(403).json({message: 'You must be logged in to delete a review'});
  }
  if (!isbn || !books[isbn]) {
    return res.status(404).json({message: 'Book not found'});
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: 'No review found for this user'});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message: 'Review deleted successfully', reviews: books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

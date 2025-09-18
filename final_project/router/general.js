const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// internal endpoints used to demonstrate async/await or Promises with axios
const internal = express.Router();
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

// internal: return raw books
internal.get('/books', (req, res) => {
  return res.json(books);
});

internal.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.json(books[isbn]);
  return res.status(404).json({message: 'Book not found'});
});

internal.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const result = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) result[isbn] = books[isbn];
  });
  return res.json(result);
});

internal.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const result = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) result[isbn] = books[isbn];
  });
  return res.json(result);
});

internal.get('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) return res.json(books[isbn].reviews);
  return res.status(404).json({message: 'Book not found'});
});

// mount internal router under /internal
public_users.use('/internal', internal);


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: 'Username and password are required'});
  }
  if (!isValid(username)) {
    return res.status(409).json({message: 'Username already exists'});
  }
  users.push({username, password});
  return res.status(201).json({message: 'User successfully registered'});
});

// Get the book list available in the shop
// Task 10: Get list of books using async/await + axios calling internal endpoint
public_users.get('/', async function (req, res) {
  try {
    const resp = await axios.get(`${BASE_URL}/internal/books`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(resp.data, null, 4));
  } catch (err) {
    return res.status(500).json({message: 'Internal error'});
  }
});

// Get book details based on ISBN
// Task 11: Get book by ISBN using async/await + axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const resp = await axios.get(`${BASE_URL}/internal/books/isbn/${encodeURIComponent(isbn)}`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(resp.data, null, 4));
  } catch (err) {
    return res.status(404).json({message: 'Book not found'});
  }
});
  
// Get book details based on author
// Task 12: Get books by author using async/await + axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const resp = await axios.get(`${BASE_URL}/internal/books/author/${encodeURIComponent(author)}`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(resp.data, null, 4));
  } catch (err) {
    return res.status(500).json({message: 'Internal error'});
  }
});

// Get all books based on title
// Task 13: Get books by title using async/await + axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const resp = await axios.get(`${BASE_URL}/internal/books/title/${encodeURIComponent(title)}`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(resp.data, null, 4));
  } catch (err) {
    return res.status(500).json({message: 'Internal error'});
  }
});

//  Get book review
//  Get book review (keeps existing synchronous behavior)
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  }
  return res.status(404).json({message: 'Book not found'});
});

module.exports.general = public_users;


# expressBookReviews — project root

This repository contains the lab starter app (in `final_project/`) and a small test harness (`tester.js`) that exercises the public and authenticated endpoints.

Quick start
1. Install dependencies for the tester (root):

```bash
cd /Users/mo/Desktop/assignment/expressBookReviews
npm install
```

2. Open a terminal and start the server (run in the `final_project` folder):

```bash
cd final_project
npm install
# start server on port 5001
PORT=5001 node index.js
```

3. In another terminal (repository root) run the automated tester which exercises the endpoints:

```bash
node tester.js
```

What the tester does
- Calls the public endpoints (list books, search by ISBN/author/title, get reviews)
- Registers a test user, logs in, adds a review, modifies it, and deletes it

Endpoints (in `final_project`)
- `GET /` — list all books
- `GET /isbn/:isbn` — get a book by ISBN
- `GET /author/:author` — get books by author
- `GET /title/:title` — get books by title
- `GET /review/:isbn` — get reviews for a book
- `POST /register` — register a new user
- `POST /customer/login` — login (creates session + JWT)
- `PUT /customer/auth/review/:isbn` — add/modify a review (authenticated)
- `DELETE /customer/auth/review/:isbn` — delete your review (authenticated)

Notes
- The app uses an in-memory user list and book database (`router/booksdb.js`); data is not persisted across restarts.
- The tester expects the server to run on port `5001`. If you need a different port, update `tester.js` `BASE` constant.

How to capture screenshots for peer review
1. In Postman: send the request and use the response pane to save a screenshot.
2. In the terminal: run the curl command shown in the `final_project/README.md` and take a screenshot of your terminal output.

If you want, I can push these changes to a GitHub remote for you — tell me the fork URL or add it as `origin` and I will push.

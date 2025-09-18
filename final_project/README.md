# final_project

This folder contains the Express Book Reviews application used for the lab.

Run the app:

```bash
cd final_project
npm install
PORT=5001 node index.js
```

Endpoints:
- `GET /` - list books
- `GET /isbn/:isbn` - get book by ISBN
- `GET /author/:author` - get books by author
- `GET /title/:title` - get books by title
- `GET /review/:isbn` - get reviews for a book
- `POST /register` - register user
- `POST /customer/login` - login
- `PUT /customer/auth/review/:isbn` - add/modify review (authenticated)
- `DELETE /customer/auth/review/:isbn` - delete review (authenticated)
Practice-Project
# Lab 2: SQLite database and CRUD routes

**Name:** Akshara  
**Registration number:** 252U1R7079  
**Section:** CSE(FSD)-2B  

## Live link
Not deployed yet. Add the public URL after deployment. If deployment is not possible, include Postman screenshots for every endpoint.

## Objective
Connect an Express server to a SQLite database and expose CRUD operations over HTTP.

## Install
Make sure Node.js and npm are installed, then run:

```bash
npm install
```

## Database
The app creates `books.db` and the `book` table automatically. The included database already contains 10 sample books. To insert the sample rows yourself using SQLite CLI on a fresh database:

```bash
sqlite3 books.db
```

At the SQLite prompt:

```sql
.read seed.sql
SELECT * FROM book;
.quit
```

Run `seed.sql` only once to avoid duplicate rows.

## Run
Development mode with automatic restart:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

Server URL: `http://localhost:3000`

## Endpoints

| Method | Path | Description | Success status |
|---|---|---|---|
| GET | `/books/` | Get all books | 200 |
| GET | `/books/:bookId/` | Get one book | 200 |
| POST | `/books/` | Add a book | 201 |
| PUT | `/books/:bookId/` | Update a book | 200 |
| DELETE | `/books/:bookId/` | Delete a book | 200 |

Unknown routes and missing book IDs return 404. Invalid input returns 400.

## Postman examples

POST `/books/` and PUT `/books/1/` → Body → raw → JSON:

```json
{
  "title": "New Book",
  "author": "Sample Author",
  "price": 299,
  "pages": 210
}
```

GET and DELETE requests do not need a body. After POST, PUT and DELETE, verify the database using:

```sql
SELECT * FROM book;
```

## Screenshots
Save the five Postman responses and SQLite CLI output in `screenshots/`:
- `get-all-books.png`
- `get-one-book.png`
- `post-book.png`
- `put-book.png`
- `delete-book.png`
- `sqlite-cli.png`

Add the screenshots here after capturing them.

## Notes
Write the actual installation or testing problems you faced and how you solved them.

## Viva

**1. Why await the database call?**  
Database operations take time. `await` waits for the result before the next step runs.

**2. What is SQL injection and how do placeholders prevent it?**  
SQL injection is an attack using harmful SQL through user input. The `?` placeholders pass values separately from the SQL command.

**3. When is PUT used instead of POST?**  
POST creates a new record. PUT updates an existing record.

# Project Gutenberg Books API

A Django REST API for querying books from Project Gutenberg database.

## Features

- **Complete filtering support**: Book IDs, language, MIME type, topic, author, title
- **Multiple values per filter**: `language=en,fr` or `topic=child,fiction`
- **Case-insensitive partial matching**: For topics, authors, and titles
- **Pagination**: Configurable page size (default: 25 books per page)
- **Sorting**: By popularity (download count, descending)
- **JSON response format**: RESTful API design

## Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure PostgreSQL database** in `root/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'gutenberg',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

3. **Start the server**:
```bash
cd root
python manage.py runserver
```

## API Documentation

### Endpoint: `GET /api/books/`

Query books with optional filters. Returns paginated results.

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|----------|
| `book_ids` | Comma-separated Project Gutenberg IDs | `1,2,3` |
| `language` | Language codes (comma-separated) | `en,fr` |
| `mime_type` | MIME types (comma-separated) | `text/plain,text/html` |
| `topic` | Search subjects & bookshelves (comma-separated) | `child,fiction` |
| `author` | Author names (case-insensitive partial match) | `carroll,dickens` |
| `title` | Title keywords (case-insensitive partial match) | `alice,wonderland` |
| `page` | Page number | `2` |
| `page_size` | Records per page (default: 25) | `10` |

### Response Format

```json
{
  "count": 1000,
  "results": [
    {
      "id": 1,
      "title": "The Declaration of Independence of the United States of America",
      "authors": [
        {
          "name": "Jefferson, Thomas",
          "birth_year": 1743,
          "death_year": 1826
        }
      ],
      "languages": ["en"],
      "subjects": ["United States -- History -- Revolution, 1775-1783 -- Sources"],
      "bookshelves": ["Politics", "United States Law"],
      "download_links": [
        {
          "mime_type": "text/plain",
          "url": "https://www.gutenberg.org/files/1/1-0.txt"
        },
        {
          "mime_type": "text/html",
          "url": "https://www.gutenberg.org/files/1/1-h/1-h.htm"
        }
      ]
    }
  ]
}
```

### Example Requests

```bash
# Get all books (first 25)
curl "http://localhost:8000/api/books/"

# Filter by language
curl "http://localhost:8000/api/books/?language=en"

# Multiple languages
curl "http://localhost:8000/api/books/?language=en,fr"

# Filter by topic (searches subjects and bookshelves)
curl "http://localhost:8000/api/books/?topic=child"

# Multiple topics
curl "http://localhost:8000/api/books/?topic=child,fiction"

# Filter by author (case-insensitive partial match)
curl "http://localhost:8000/api/books/?author=carroll"

# Filter by title (case-insensitive partial match)
curl "http://localhost:8000/api/books/?title=alice"

# Filter by MIME type
curl "http://localhost:8000/api/books/?mime_type=text/plain"

# Filter by specific book IDs
curl "http://localhost:8000/api/books/?book_ids=1,2,3"

# Combined filters with pagination
curl "http://localhost:8000/api/books/?language=en&topic=fiction&page_size=10&page=2"

# Complex query
curl "http://localhost:8000/api/books/?language=en&author=dickens&topic=fiction&mime_type=text/plain"
```

## Database Schema

The API works with the Project Gutenberg PostgreSQL database dump containing:

- `books_book` - Main book information
- `books_author` - Author details
- `books_language` - Language codes
- `books_subject` - Book subjects
- `books_bookshelf` - Book categories
- `books_format` - Download formats and URLs
- Junction tables for many-to-many relationships

## Testing

```bash
# Run tests against original database
python manage.py test books --keepdb

# Verbose test output
python manage.py test books --keepdb --verbosity=2
```

## Project Structure

```
projectforignite/
├── root/
│   ├── books/
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API endpoints
│   │   ├── urls.py        # URL routing
│   │   └── tests.py       # Test cases
│   ├── root/
│   │   ├── settings.py    # Django configuration
│   │   └── urls.py        # Main URL routing
│   └── manage.py          # Django management
├── requirements.txt       # Dependencies
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## Dependencies

- Django >= 4.2.0
- psycopg2-binary >= 2.9.0
- gunicorn >= 20.1.0 (for production)

## Key Features Implemented

✅ **Multiple filter criteria** - All filters can be combined  
✅ **Multiple values per filter** - Comma-separated values supported  
✅ **Case-insensitive partial matching** - For topics, authors, titles  
✅ **Pagination** - 25 books per page by default, configurable  
✅ **Popularity sorting** - Books ordered by download count  
✅ **Complete book information** - Authors, languages, subjects, bookshelves, download links  
✅ **RESTful JSON API** - Clean, consistent response format
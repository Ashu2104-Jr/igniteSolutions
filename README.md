# Project Gutenberg Books API

A Django REST API with React frontend for querying books from Project Gutenberg database.

## Features

- **Complete filtering support**: Book IDs, language, MIME type, topic, author, title
- **Multiple values per filter**: Select multiple languages, topics, authors, etc.
- **Case-insensitive partial matching**: For topics, authors, and titles
- **Pagination**: Configurable page size (default: 25 books per page)
- **Sorting**: By popularity (download count, descending)
- **Interactive UI**: React frontend with filter tags and remove buttons
- **JSON response format**: RESTful API design

## Quick Start

### Backend Setup

1. **Install Python dependencies**:
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

3. **Start Django server**:
```bash
cd root
python manage.py runserver
```

### Frontend Setup

1. **Install Node.js dependencies**:
```bash
cd frontend
npm install
```

2. **Start React development server**:
```bash
npm start
```

### Access the Application

- **React Frontend**: http://localhost:3000
- **Django API**: http://localhost:8000/api/books/

## UI Features

### Filter System
- **Multiple Selection**: Choose multiple languages, topics, authors
- **Filter Tags**: Selected filters appear as removable blue tags
- **Smart Dropdowns**: Hide already selected options
- **Text Inputs**: Add Book IDs and titles by pressing Enter
- **Remove Individual**: Click X on any tag to remove specific filter

### Book Display
- **Scrollable List**: Window-height container with scroll
- **Book Cards**: Title, authors, languages, subjects, download links
- **Responsive Design**: Works on desktop and mobile

### Pagination
- **Next/Previous**: Navigate through pages
- **Page Info**: Shows current page and total pages
- **Page Size**: Choose 10, 25, 50, or 100 books per page
- **Total Count**: Display total matching books

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
        }
      ]
    }
  ]
}
```

### Example API Requests

```bash
# Multiple languages
curl "http://localhost:8000/api/books/?language=en,fr"

# Multiple topics
curl "http://localhost:8000/api/books/?topic=child,fiction"

# Combined filters
curl "http://localhost:8000/api/books/?language=en&author=dickens&topic=fiction"
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
├── root/                  # Django backend
│   ├── books/
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API endpoints
│   │   ├── urls.py        # URL routing
│   │   └── tests.py       # Test cases
│   ├── root/
│   │   ├── settings.py    # Django configuration
│   │   └── urls.py        # Main URL routing
│   └── manage.py          # Django management
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   └── index.js       # React entry point
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Node.js dependencies
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## Dependencies

### Backend
- Django >= 4.2.0
- psycopg2-binary >= 2.9.0
- gunicorn >= 20.1.0 (for production)

### Frontend
- React ^18.2.0
- axios ^1.6.0
- react-scripts 5.0.1

## Key Features Implemented

✅ **Multiple filter criteria** - All filters can be combined  
✅ **Multiple values per filter** - Comma-separated values supported  
✅ **Case-insensitive partial matching** - For topics, authors, titles  
✅ **Interactive filter tags** - Visual tags with remove buttons  
✅ **Pagination** - 25 books per page by default, configurable  
✅ **Popularity sorting** - Books ordered by download count  
✅ **Complete book information** - Authors, languages, subjects, bookshelves, download links  
✅ **Responsive UI** - Works on desktop and mobile  
✅ **RESTful JSON API** - Clean, consistent response format
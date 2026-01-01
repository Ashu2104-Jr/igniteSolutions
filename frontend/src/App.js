import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  const [filters, setFilters] = useState({
    book_ids: [],
    language: [],
    mime_type: [],
    topic: [],
    author: [],
    title: []
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    languages: ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'fi', 'sv', 'da'],
    mimeTypes: ['text/plain', 'text/html', 'application/epub+zip', 'application/pdf', 'text/xml'],
    topics: ['Fiction', 'History', 'Biography', 'Poetry', 'Philosophy', 'Science', 'Children', 'Adventure', 'Romance', 'Mystery'],
    authors: ['Dickens', 'Shakespeare', 'Twain', 'Carroll', 'Austen', 'Doyle', 'Wells', 'Verne', 'Wilde', 'Hardy']
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.append(key, values.join(','));
        }
      });
      
      params.append('page', currentPage);
      params.append('page_size', pageSize);

      const response = await axios.get(`/api/books/?${params}`);
      setBooks(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize]);

  const handleFilterAdd = (key, value) => {
    if (value && !filters[key].includes(value)) {
      setFilters(prev => ({
        ...prev,
        [key]: [...prev[key], value]
      }));
      setCurrentPage(1);
    }
  };

  const handleFilterRemove = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item !== value)
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBooks();
  };

  const handleClearFilters = () => {
    setFilters({
      book_ids: [],
      language: [],
      mime_type: [],
      topic: [],
      author: [],
      title: []
    });
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="app">
      <header className="header">
        <h1>Project Gutenberg Books</h1>
      </header>

      <div className="filters-section">
        <h2>Filters</h2>
        
        {/* Selected Filters Display */}
        <div className="selected-filters">
          {Object.entries(filters).map(([key, values]) => 
            values.map(value => (
              <div key={`${key}-${value}`} className="filter-tag">
                <span>{key}: {value}</span>
                <button 
                  onClick={() => handleFilterRemove(key, value)}
                  className="remove-filter"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Book IDs:</label>
            <input
              type="text"
              placeholder="Enter ID and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFilterAdd('book_ids', e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>

          <div className="filter-group">
            <label>Language:</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleFilterAdd('language', e.target.value);
                }
              }}
            >
              <option value="">Select Language</option>
              {dropdownOptions.languages.filter(lang => !filters.language.includes(lang)).map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>MIME Type:</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleFilterAdd('mime_type', e.target.value);
                }
              }}
            >
              <option value="">Select Type</option>
              {dropdownOptions.mimeTypes.filter(type => !filters.mime_type.includes(type)).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Topic:</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleFilterAdd('topic', e.target.value);
                }
              }}
            >
              <option value="">Select Topic</option>
              {dropdownOptions.topics.filter(topic => !filters.topic.includes(topic)).map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Author:</label>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleFilterAdd('author', e.target.value);
                }
              }}
            >
              <option value="">Select Author</option>
              {dropdownOptions.authors.filter(author => !filters.author.includes(author)).map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Title:</label>
            <input
              type="text"
              placeholder="Enter title and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleFilterAdd('title', e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleSearch} className="search-btn">Search</button>
          <button onClick={handleClearFilters} className="clear-btn">Clear Filters</button>
        </div>
      </div>

      <div className="results-section">
        <div className="results-header">
          <h2>Results ({totalCount} books found)</h2>
          <div className="page-size-selector">
            <label>Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : books.length > 0 ? (
          <div className="books-container">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <div className="book-details">
                  <p><strong>Authors:</strong> {book.authors.map(a => a.name).join(', ')}</p>
                  <p><strong>Languages:</strong> {book.languages.join(', ')}</p>
                  <p><strong>Subjects:</strong> {book.subjects.slice(0, 3).join(', ')}</p>
                  <p><strong>Bookshelves:</strong> {book.bookshelves.slice(0, 3).join(', ')}</p>
                  <div className="download-links">
                    <strong>Downloads:</strong>
                    {book.download_links.slice(0, 3).map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.mime_type}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No books found. Try adjusting your search criteria.</p>
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
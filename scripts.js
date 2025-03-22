import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
// Initializes the bookstore with books, authors, genres, and books per page. Calls init to set up the initial state.
class BookStore {
    constructor(books, authors, genres, booksPerPage) {
        this.books = books;
        this.authors = authors;
        this.genres = genres;
        this.booksPerPage = booksPerPage;
        this.page = 1;
        this.matches = books;
        this.init();
    }

    init() {
        this.renderBooks(this.matches.slice(0, this.booksPerPage));
        this.populateSelectOptions('[data-search-genres]', this.genres, 'All Genres');
        this.populateSelectOptions('[data-search-authors]', this.authors, 'All Authors');
        this.sedocument.querySelector('[data-list-items]').addEventListener('book-selected', (event) => {
            this.showBookDetails(event.detail.id);
        });
        tupTheme();
        this.updateShowMoreButton();
        this.addEventListeners();
    }

    //removed create book element 

        renderBooks(books) {
        const fragment = document.createDocumentFragment();
        books.forEach(({ author, id, image, title }) => {
            const bookPreview = document.createElement('book-preview');
            bookPreview.setAttribute('id', id);
            bookPreview.setAttribute('title', title);
            bookPreview.setAttribute('author', this.authors[author]);
            bookPreview.setAttribute('image', image);
            fragment.appendChild(bookPreview);
        });

    
        const listContainer = document.querySelector('[data-list-items]');
        listContainer.innerHTML = ''; // Clear previous entries
        listContainer.appendChild(fragment);
    }
    
    

    setupTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.applyTheme('night');
        } else {
            this.applyTheme('day');
        }
    }

    applyTheme(theme) {
        const colorSettings = theme === 'night' ? ['255, 255, 255', '10, 10, 20'] : ['10, 10, 20', '255, 255, 255'];
        document.querySelector('[data-settings-theme]').value = theme;
        document.querySelector('[data-list-items]').addEventListener('book-selected', (event) => {
            this.showBookDetails(event.detail.id);
        });
         document.documentElement.style.setProperty('--color-dark', colorSettings[0]);
        document.documentElement.style.setProperty('--color-light', colorSettings[1]);
    }

    updateShowMoreButton() {
        const remainingBooks = this.matches.length - (this.page * this.booksPerPage);
        document.querySelector('[data-list-button]').innerText = `Show more (${remainingBooks})`;
        document.querySelector('[data-list-button]').disabled = remainingBooks <= 0;
        document.querySelector('[data-list-button]').innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
        `;
    }

    addEventListeners() {
        document.querySelector('[data-search-cancel]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = false;
        });

        document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = false;
        });

        document.querySelector('[data-header-search]').addEventListener('click', () => {
            document.querySelector('[data-search-overlay]').open = true;
            document.querySelector('[data-search-title]').focus();
        });

        document.querySelector('[data-header-settings]').addEventListener('click', () => {
            document.querySelector('[data-settings-overlay]').open = true;
        });

        document.querySelector('[data-list-close]').addEventListener('click', () => {
            document.querySelector('[data-list-active]').open = false;
        });

        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);
            this.applyTheme(theme);
            document.querySelector('[data-settings-overlay]').open = false;
        });

        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const filters = Object.fromEntries(formData);
            this.applyFilters(filters);
        });

        document.querySelector('[data-list-button]').addEventListener('click', () => {
            this.loadMoreBooks();
        });

        document.querySelector('[data-list-items]').addEventListener('click', (event) => {
            this.showBookDetails(event);
        });
    }

    applyFilters(filters) {
        const result = this.books.filter(book => {
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
            const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            return genreMatch && titleMatch && authorMatch;
        });

        this.page = 1;
        this.matches = result;
        this.updateShowMoreButton();
        this.renderBooks(result.slice(0, this.booksPerPage));
        document.querySelector('[data-search-overlay]').open = false;
        document.querySelector('[data-list-message]').classList.toggle('list__message_show', result.length === 0);
    }

    loadMoreBooks() {
        this.page += 1;
        this.renderBooks(this.matches.slice((this.page - 1) * this.booksPerPage, this.page * this.booksPerPage));
        this.updateShowMoreButton();
    }
    showBookDetails(bookId) {
        const activeBook = this.books.find(book => book.id === bookId);
    
        if (activeBook) {
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = activeBook.image;
            document.querySelector('[data-list-image]').src = activeBook.image;
            document.querySelector('[data-list-title]').innerText = activeBook.title;
            document.querySelector('[data-list-subtitle]').innerText = `${this.authors[activeBook.author]} (${new Date(activeBook.published).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = activeBook.description;
        }
    }
    
    
}

document.addEventListener('DOMContentLoaded', () => {
    new BookStore(books, authors, genres, BOOKS_PER_PAGE);
});
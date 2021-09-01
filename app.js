//Represent book
class Book {
    constructor( title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//handle UI 
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');

        div.className = `alert alert-${className} display-6  d-flex justify-content-center text-center`;
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, form);

        //delete alert
        setTimeout(() => document.querySelector('.alert').remove(),
        1500);
        
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            
        }
    }

    static clearFields() {
        document.getElementById('title').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }
}
 
//handle storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books =[];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//add book
document.getElementById('book-form').addEventListener('submit', (e) =>{

    e.preventDefault();

    //get values from form
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //all fields must be filled
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

    //instantiate book
    const book = new Book(title, author, isbn);
    console.log(book);

    //add to UI
    UI.addBookToList(book);

    //add to localStorage
    Store.addBook(book);

    //success message
    UI.showAlert('Book added', 'success');
    
    //clear field
    UI.clearFields();

    }

    
});

//remove book
document.getElementById('book-list').addEventListener('click', (e) => {
    e.stopPropagation();
    //remove from UI
    UI.deleteBook(e.target);
    //success alert
    UI.showAlert('Successfully removed a book', 'success')
    //remove from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})
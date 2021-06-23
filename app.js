class Book {
    constructor(title,author,isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {       

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book)); //Loop through the array and add the book
    }

     static addBookToList(book) { 
        const list = document.querySelector('#book-list'); //initializing the list

        const row = document.createElement('tr'); 
        row.innerHTML = `<td>${book.title}</td>
                         <td>${book.author}</td>
                         <td>${book.isbn}</td>
                         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;
        list.appendChild(row);                 
     }

     static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
     }

     static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        //Vanish in 3 secs
        setTimeout(() => document.querySelector('.alert').remove(),2000);
     }

     static clearFields() {
         document.querySelector('#title').value = '';
         document.querySelector('#author').value = '';
         document.querySelector('#isbn').value = '';
     }
}
    //Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        } return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book,index) => {
            if(books.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded',UI.displayBooks); //Displaying books
document.querySelector('#book-form').addEventListener('submit', (e) => {

    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill the fields!', 'danger');
    } else {
        const book = new Book(title,author,isbn);

    //Adding books
    UI.addBookToList(book);

    //Adding books to Storage
    Store.addBook(book);

    UI.showAlert('Book Added','success');

    //Clear Fields
    UI.clearFields();
    }
    
});

    //Remove a book
    document.querySelector('#book-list').addEventListener('click',(e) => {
        //Remove book from UI
        UI.deleteBook(e.target);

        //Remove book from Storage
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent); 
        UI.showAlert('Book Removed','success');

    });
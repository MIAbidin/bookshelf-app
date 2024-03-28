document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("addButton");
    const modal = document.getElementById("myModal");
    const closeButton = document.getElementsByClassName("close")[0];
    const bookForm = document.getElementById("bookForm");
    const completedBooks = document.querySelector(".row-completed");
    const incompletedBooks = document.querySelector(".row-incompleted");
    const circleComplete = document.querySelector(".circle.complete p");
    const circleIncomplete = document.querySelector(".circle.incomplete p");
    const editModal = document.getElementById("editModal");
    
  
    let books = [];
    if (localStorage.getItem("books")) {
      books = JSON.parse(localStorage.getItem("books"));
      renderBooks();
    }
  
    addButton.onclick = function () {
      modal.style.display = "block";
    };
  
    closeButton.onclick = function () {
      modal.style.display = "none";
    };
  
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    document.getElementById("image").addEventListener("change", function () {
        const reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById("image-preview").src = e.target.result;
          document.getElementById("image-preview").style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
      });
  
    bookForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      const year = Number(document.getElementById("year").value);
      const genre = document.getElementById("genre").value;
      const isComplete = document.getElementById("completed").checked;
      const id = +new Date();
      const imageSrc = document.getElementById("image-preview").src;
  
      const newBook = {
        id: id,
        title: title,
        author: author,
        year: year,
        genre: genre,
        isComplete: isComplete,
        imageSrc: imageSrc,
      };
  
      books.push(newBook);
      localStorage.setItem("books", JSON.stringify(books));
      modal.style.display = "none";
      renderBooks();
      renderGenres();
      updateCircleCounts();
      bookForm.reset();
    });

    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("change-button") || event.target.classList.contains("fa-exchange-alt")) {
        const bookId = event.target.closest(".book-row").dataset.id;
        const index = books.findIndex((book) => book.id == bookId);
        books[index].isComplete = !books[index].isComplete;
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
        renderGenres();
        updateCircleCounts();
      }
    });
    
  
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-button") || event.target.classList.contains("fa-trash-alt")) {
        const bookId = event.target.parentElement.parentElement.parentElement.dataset.id;
        const index = books.findIndex((book) => book.id == bookId);
        
        const deleteConfirmationModal = document.getElementById("deleteConfirmationModal");
        deleteConfirmationModal.style.display = "block";
        
        document.getElementById("confirmDeleteButton").onclick = function () {
          books.splice(index, 1);
          localStorage.setItem("books", JSON.stringify(books));
          deleteConfirmationModal.style.display = "none";
          
          renderBooks();
          renderGenres();
          updateCircleCounts();
        };
        
        document.getElementById("cancelDeleteButton").onclick = function () {
          deleteConfirmationModal.style.display = "none";
        };
      }
    });

    document.getElementById("edit-image").addEventListener("change", function () {
      const reader = new FileReader();
      reader.onload = function (e) {
          document.getElementById("edit-image-preview").src = e.target.result;
          document.getElementById("edit-image-preview").style.display = "block";
      };
      reader.readAsDataURL(this.files[0]);
    });
  
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("edit-button") || event.target.classList.contains("fa-edit")) {
        const bookRow = event.target.closest(".book-row");
        if (bookRow) {
          const bookId = bookRow.dataset.id;
          const index = books.findIndex((book) => book.id == bookId);
          const selectedBook = books[index];
    
          document.getElementById("edit-title").value = selectedBook.title;
          document.getElementById("edit-author").value = selectedBook.author;
          document.getElementById("edit-year").value = selectedBook.year;
          document.getElementById("edit-genre").value = selectedBook.genre;
          document.getElementById("edit-completed").checked = selectedBook.isComplete;
    
          if (selectedBook.imageSrc) {
            document.getElementById("edit-image-preview").src = selectedBook.imageSrc;
            document.getElementById("edit-image-preview").style.display = "block";
          } else {
            document.getElementById("edit-image-preview").style.display = "none";
          }
    
          editModal.style.display = "block";
    
          document.getElementById("edit-save").onclick = function () {
            books[index].title = document.getElementById("edit-title").value;
            books[index].author = document.getElementById("edit-author").value;
            books[index].year = Number(document.getElementById("edit-year").value);
            books[index].genre = document.getElementById("edit-genre").value;
            books[index].isComplete = document.getElementById("edit-completed").checked;
    
            const editedImageSrc = document.getElementById("edit-image-preview").src;
            if (editedImageSrc !== selectedBook.imageSrc) {
              books[index].imageSrc = editedImageSrc;
            }
    
            localStorage.setItem("books", JSON.stringify(books));
    
            renderBooks();
            renderGenres();
    
            editModal.style.display = "none";
          };
    
          document.getElementById("edit-close").onclick = function () {
            editModal.style.display = "none";
          };
        }
      }
    });
    
  
    function renderBooks() {
      completedBooks.innerHTML = "";
      incompletedBooks.innerHTML = "";
  
      books.forEach((book) => {
        const bookCard = `
          <div class="book-row" data-id="${book.id}">
            <div class="book-info">
                <img src="${book.imageSrc}" alt="Book Image">
            </div>
            <div class="book-details">
              <h3>${book.title}</h3>
              <p>Author: ${book.author}</p>
              <p>Year: ${book.year}</p>
              <p>Genre: ${book.genre}</p>
              <div class="buttons">
                <button class="change-button"><i class="fas fa-exchange-alt"></i></button>
                <button class="edit-button"><i class="fas fa-edit"></i></button>
                <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
            </div>

            </div>
          </div>`;
  
        if (book.isComplete) {
          completedBooks.innerHTML += bookCard;
        } else {
          incompletedBooks.innerHTML += bookCard;
        }
      });
      updateCircleCounts();
    }
    function updateCircleCounts() {
        const completedCount = books.filter((book) => book.isComplete).length;
        const incompletedCount = books.filter((book) => !book.isComplete).length;
    
        circleComplete.textContent = completedCount;
        circleIncomplete.textContent = incompletedCount;
    }

    document.getElementById("search-input").addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const searchResults = books.filter(book => {
          return (
              book.title.toLowerCase().includes(searchTerm) ||
              book.author.toLowerCase().includes(searchTerm) ||
              book.year.toString().includes(searchTerm) ||
              book.genre.toLowerCase().includes(searchTerm)
          );
      });
      renderSearchResults(searchResults);
    });

    function renderSearchResults(results) {
        completedBooks.innerHTML = "";
        incompletedBooks.innerHTML = "";

        results.forEach(book => {
            const bookCard = `
                <div class="book-row" data-id="${book.id}">
                    <div class="book-info">
                        <img src="${book.imageSrc}" alt="Book Image">
                    </div>
                    <div class="book-details">
                        <h3>${book.title}</h3>
                        <p>Author: ${book.author}</p>
                        <p>Year: ${book.year}</p>
                        <p>Genre: ${book.genre}</p>
                        <div class="buttons">
                          <button class="change-button"><i class="fas fa-exchange-alt"></i></button>
                          <button class="edit-button"><i class="fas fa-edit"></i></button>
                          <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>`;

            if (book.isComplete) {
                completedBooks.innerHTML += bookCard;
            } else {
                incompletedBooks.innerHTML += bookCard;
            }
        });
    }

    function getUniqueGenres() {
      const uniqueGenres = [];
      books.forEach(book => {
          if (!uniqueGenres.includes(book.genre.toLowerCase())) {
              uniqueGenres.push(book.genre.toLowerCase());
          }
      });
      return uniqueGenres;
    }

    function getGenreCounts() {
        const genreCounts = {};
        books.forEach(book => {
            const genre = book.genre.toLowerCase();
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
        return genreCounts;
    }

    function renderGenres() {
        const genreBox = document.querySelector('.genre-box ul');
        genreBox.innerHTML = '';
        const uniqueGenres = getUniqueGenres();
        const genreCounts = getGenreCounts();
        uniqueGenres.forEach(genre => {
            const listItem = document.createElement('li');
            listItem.textContent = `${genre} (${genreCounts[genre]})`;
            listItem.dataset.genre = genre;
            listItem.addEventListener('click', function () {
                const selectedGenre = this.dataset.genre;
                const searchResults = books.filter(book => book.genre.toLowerCase() === selectedGenre);
                renderSearchResults(searchResults);
            });
            genreBox.appendChild(listItem);
        });

        const allBooksCount = books.length;
        const allBooksListItem = document.createElement('li');
        allBooksListItem.textContent = `All Genres (${allBooksCount})`;
        allBooksListItem.addEventListener('click', function () {
            renderBooks();
        });
        genreBox.appendChild(allBooksListItem);
    }

    renderGenres();

});
  
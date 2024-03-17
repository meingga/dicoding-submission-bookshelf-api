const { nanoid } = require('nanoid');
const books = require('./books');

// menyimpan buku
const addBookHandler = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    if (!name) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }


    const response = res.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Menampilkan semua buku atau sesuai parameter query
const getAllBooksHandler = (req, res) => {

    const { name, reading, finished } = req.query;
    let booksFilter = books;
    const booksTmp = [];

    if (name) {
        booksFilter = books.filter((x) => x.name.toUpperCase().includes(name.toUpperCase()))
    }

    if (reading && /^[0-1]+$/.test(reading)) {
        booksFilter = books.filter((x) => x.reading === reading.includes(1))
    }

    if (finished && /^[0-1]+$/.test(finished)) {
        booksFilter = books.filter((x) => x.finished === finished.includes(1))
    }

    booksFilter.forEach(book => {
        const tmp = {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }

        booksTmp.push(tmp);
    });

    return res.response({
        status: 'success',
        data: {
            books: booksTmp,
        },
    }).code(200);
};

// Menampilkan detail buku
const getBookByIdHandler = (req, res) => {

    const { bookId } = req.params;

    const book = books.filter(n => n.id === bookId)[0];

    if (book) {
        return res.response({
            status: 'success',
            data: {
                book: book,
            },
        }).code(200);
    }

    return res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    }).code(404);
};

// Mengedit buku
const updateBookByIdHandler = (req, res) => {
    const { bookId } = req.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

    if (!name) {
        const response = res.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        })
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex(x => x.id === bookId);

    if (index !== -1) {
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage ? true : false;
        books[index] = { ...books[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt };
        const response = res.response({
            status: "success",
            message: "Buku berhasil diperbarui",
            data: {
                book: books[index],
            },
        })
        response.code(200);
        return response;
    }

    const response = res.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    })
    response.code(404);
    return response;
}

// Menghapus buku
const deleteBookByIdHandler = (req, res) => {
    const { bookId } = req.params;

    const index = books.findIndex(x => x.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = res.response({
            status: "success",
            message: "Buku berhasil dihapus"
        })
        response.code(200);
        return response;
    }

    const response = res.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan"
    })
    response.code(404);
    return response;
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };
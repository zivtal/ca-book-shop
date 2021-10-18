'use strict';

const STAR = '⭐';
var gViewMode = 'GRID';

function init() {
    renderBooks();
    renderControls();
}

function renderControls() {
    document.querySelector('.byrate').innerHTML = renderSortByRate();
    document.querySelector('.byauthor').innerHTML = renderSortByAuthor();
}

function renderBooks(books = getBooksForDisplay()) {
    var strHtml = (gViewMode === 'GRID') ? renderAsGrid(books) : renderAsTable(books);
    document.querySelector('.books').innerHTML = strHtml;
    renderPagesNav();
}

function renderPagesNav(active = getPage(), last = getNumberOfPages()) {
    const nav = {
        start: (active === last - 1) ? Math.max(0, active - 2) : Math.max(0, active - 1),
        end: (active === 0) ? Math.min(last, active + 3) : Math.min(last, active + 2),
        previous: (active > 0) ? active - 1 : null,
        next: (last > 0 && active < last - 1) ? active + 1 : null,
    }
    var strHtml = '';
    strHtml += (nav.previous < active) ? `<span class="page" onclick="onPageChange(${nav.previous})"> « </span>` : `<span class="page disabled"> « </span>`;
    for (var i = nav.start; i < nav.end; i++) {
        strHtml += `<span class="page${(i === active) ? ' clicked' : ''}" onclick="onPageChange(${i})"> ${i + 1} </span>`
    }
    strHtml += (nav.next) ? `<span class="page" onclick="onPageChange(${nav.next})"> » </span>` : `<span class="page disabled"> » </span>`;
    document.querySelector('.pages').innerHTML = strHtml;
}


function renderAsGrid(books) {
    books = books.map(book => {
        if (book.sale && book.sale !== book.price) {
            var price = `<p>Price: 
                            <span class="sale" style="color:red">$${book.sale}</span> 
                            <span class="price">$${book.price}</span> 
                            <span class="precent">(${Math.round((1 - book.sale / book.price) * 100)}%)</span>
                        </p>`;
        } else {
            var price = `<p>Price: <span class="sale">$${book.price}</span></p>`;
        }
        return `<article class="preview" onclick="openReadModal('${book.id}',this)">
                    <button class="remove" onclick="onRemoveBookClick(event,'${book.id}')">X</button>
                    <img src="img/${book.id}.jpg" onerror="this.src='img/book.jpg';"/>
                    <h1>${book.title}</h1>
                    <h2>by ${book.author}</h2>
                    ${price}
                    <div class="stars">${STAR.repeat(Math.round(book.rate))}</div>
               </article>`});
    return books.join('');
}

function renderAsTable(books) {
    books = books.map((book, idx) => {
        return `<tr>
            <td><img src="img/${book.id}.jpg" onerror="this.src='img/book.jpg';"/></td>
            <td>${book.id}</td>
            <td class="title">${book.title}</td>
            <td>${book.price}</td>
            <td>${book.sale}</td>
            <td onclick="openReadModal('${book.id}',this)"><span class="btn btn1">Read</span></td>
            <td onclick="openEditModal('${book.id}',this)"><span class="btn btn2">Update</span></td>
            <td onclick="onRemoveBookClick(event,'${book.id}')"><span class="btn btn3">Delete<span></td>
        </tr>`});
    return `<table>
            <tr>
                <th>Picture</th>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Action</th>
            </tr>
            ${books.join('')}
            </table>`;
}

function renderSortByRate() {
    var rates = getAvailableRates();
    if (!rates) return;
    rates = rates.map(rate => `<option value="${rate}">${rate}</option>`);
    return `<option></option>${rates.join('')}`;
}

function renderSortByAuthor() {
    var authors = getAvailableAuthors();
    if (!authors) return;
    authors = authors.map(author => `<option value="${author}">${author}</option>`);
    return `<option></option>${authors.join('')}`;
}

function openReadModal(bookId, el) {
    const book = getBookById(bookId);
    const strHtml = `
    <button class="close" onclick="onClickClose(this)">X</button>
    <img src="img/${book.id}.jpg" style="height:auto;" onerror="this.src='img/book.jpg';"/>
    <div><p class="id">ISBN-13: <span>${book.id}</span></p></div>
    <div><p>Title: <span>${book.title}</span></p></div>
    <div><p>Author: <span>${book.author}</span></p></div>
    <div><p>Price:</p> $${book.price}</div>
    ${(book.sale && book.sale > 0) ? `<div><p>Sale price:</p> <span style="color:red;">$${book.sale} (${Math.round((1 - book.sale / book.price) * 100)}%)</span></div>` : ''}
    <div><p>Description:</p> <span>${book.desc}</span></div>
    <button class="edit" onclick="openEditModal('${book.id}')">Edit</button>
    `;
    const elDetails = document.querySelector('.details');
    elDetails.innerHTML = strHtml;
    if (el) elDetails.style.top = getOffset(el, 0.5, 0).top + 'px';
    elDetails.style.display = 'block';
}

/// change to labels

function openEditModal(bookId, el) {
    if (!bookId) {
        var book = createBook(-1);
        var btnText = 'Add';
    } else {
        var book = getBookById(bookId);
        var btnText = 'Update';
    }
    const strHtml = `
    <button class="close" onclick="onClickClose(this)">X</button>
    <img src="img/${book.id}.jpg" style="height:300px;" onerror="this.src='img/book.jpg';"/>
        <label>ISBN-13: <input class="isbn13" type="text" value="${(book.id > 0) ? book.id : ''}"></input></label>
        <label>Title: <input class="title" type="text" value="${book.title}"></input></label>
        <label>Author: <input class="author" type="text" value="${book.author}"></input></label>
        <label>Price: <input class="price" type="number" value="${book.price}"></input></label>
        <label>Sale price: <input class="sale" type="number" value="${book.sale}"></input></label>
        <label>Rate: <input class="rate" type="number" value="${book.rate}" min="0" max="5"></input></label>
        <p>Description:</p>
        <textarea class="desc" value="">${book.desc}</textarea>
    </div>
    <button class="submit" onclick="onClickSave(this,'${book.id}')">${btnText}</button>
    `;
    const elDetails = document.querySelector('.details');
    elDetails.innerHTML = strHtml;
    if (el) elDetails.style.top = getOffset(el, 0.5, 0).top + 'px';
    elDetails.style.display = 'block';
}

function getOffset(el, top = 0, left = 0) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY + (rect.height * parseFloat(top)),
        left: rect.left + window.scrollX + (rect.width * parseFloat(left)),
    }
}

function onClickViewMode(mode) {
    gViewMode = mode;
    renderBooks();
}

function onSetSort(key, value) {
    setSortBy(key, value);
    renderBooks();
}

function onSetFilter(key, value) {
    setFilterBy(key, value);
    renderBooks();
}

function onPageChange(page) {
    setPage(page);
    renderBooks();
}

function onClickSave(elBtn, bookId) {
    const elDetails = elBtn.parentElement;
    const book = {
        id: (bookId) ? bookId : -1,
        title: elDetails.querySelector('.title').value,
        author: elDetails.querySelector('.author').value,
        price: elDetails.querySelector('.price').value,
        sale: elDetails.querySelector('.sale').value,
        desc: elDetails.querySelector('.desc').value,
        rate: elDetails.querySelector('.rate').value,
    }
    saveBook(book);
    onClickClose(elBtn);
    renderBooks();
}

function onClickClose(elBtn) {
    elBtn.parentElement.style.display = 'none';
}

function onRemoveBookClick(ev, bookId) {
    ev.stopPropagation();
    removeBook(bookId);
    renderControls();
    renderBooks();
}
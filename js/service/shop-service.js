'use strict';

const KEY = 'books';

var gBooks = loadBooks();
var gPages = {
    size: 3,    // books per page
    index: 0,
    total: 0,
}
var gFilterBy = {
    rate: '',
    author: '',
};
var gSortBy = {
    by: 'TITLE',
    descending: true,
};

function loadBooks() {
    var books = loadFromStorage(KEY);
    if (!books || !books.length) books = _createBooks();
    return books;
}

function getBooksForDisplay() {
    var books = gBooks.slice();
    if (gFilterBy.rate || gFilterBy.author) {
        books = books.filter(book => {
            if (gFilterBy.rate && book.rate < String(gFilterBy.rate).length) return false;
            if (gFilterBy.author && !String(book.author).includes(gFilterBy.author)) return false;
            return true;
        });
    }
    switch (gSortBy.by) {
        case 'TITLE':
            books = books.sort((a, b) => {
                if (gSortBy.descending) {
                    return ((b.title > a.title) ? 1 : (b.title < a.title) ? -1 : 0);
                } else {
                    return ((b.title > a.title) ? -1 : (b.title < a.title) ? 1 : 0);
                }
            });
            break;
        case 'PRICE':
            books = books.sort((a, b) => {
                var price = {
                    a: (a.sale) ? a.sale : a.price,
                    b: (b.sale) ? b.sale : b.price,
                }
                return (gSortBy.descending) ? price.a - price.b : price.b - price.a
            }
            );
            break;
        case 'RATE':
            books = books.sort((a, b) => (gSortBy.descending) ? b.rate - a.rate : a.rate - b.rate);
            break;
    }
    gPages.total = Math.ceil(books.length / gPages.size);
    if (gPages.index >= gPages.total) gPages.index = gPages.total - 1;
    return books.splice(gPages.index * (gPages.size), gPages.size);
}

function getAvailableRates(books = gBooks) {
    var rates = [];
    books.forEach(book => {
        var stars = STAR.repeat(Math.round(book.rate));
        if (stars.length > 0 && !rates.includes(stars)) rates.push(stars);
    });
    return rates.sort((a, b) => b.length - a.length);
}

function getAvailableAuthors(books = gBooks) {
    var authors = [];
    books.forEach(book => {
        var strAutors = book.author;
        strAutors = strAutors.split(',');
        strAutors.forEach(author => {
            author = author.trim();
            if (!authors.includes(author)) authors.push(author);
        });
    });
    return authors.sort();
}

function setSortBy(key, value) {
    gSortBy[key] = (value) ? value : !gSortBy[key];
}

function setFilterBy(key, value) {
    gFilterBy[key] = (value) ? value : !gFilterBy[key];
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId);
}

function removeBook(bookId) {
    const idx = gBooks.findIndex(book => book.id === bookId);
    const remove = gBooks.splice(idx, 1);
    saveToStorage(KEY, gBooks);
    return remove;
}

function saveBook(book) {
    if (book.id < 0) {
        book.id = getNextId();
        gBooks.push(book);
    } else {
        const idx = gBooks.findIndex((item) => item.id === book.id);
        gBooks[idx] = book;
    }
    saveToStorage(KEY, gBooks);
}

function getNextId() {
    return getRandomInt(1000000000000, 9999999999999).toString();
}

function getNumberOfPages() {
    return gPages.total;
}

function getPage() {
    return gPages.index;
}

function setPage(page) {
    gPages.index = page;
}

function createBook(isbn13, title, author, price, sale, desc, rate, image) {
    return {
        id: (isbn13) ? isbn13.toString() : getNextId(),
        title: (title) ? title : '',
        author: (author) ? author : '',
        price: (price) ? price : 0,
        sale: (sale) ? sale : 0,
        desc: (desc) ? desc : '',
        rate: (rate) ? rate : 0,
        image: (image) ? image : '',
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function _createBooks() {
    const demo = [
        createBook(9781250784094, 'The Book of Hope', 'Jane Goodall, Douglas Abrams', 28, 22.49, 'In a world that seems so troubled, how do we hold on to hope?\nLooking at the headlines—the worsening climate crisis, a global pandemic, loss of biodiversity, political upheaval—it can be hard to feel optimistic. And yet hope has never been more desperately needed.\nIn this urgent book, Jane Goodall, the world\'s most famous living naturalist, and Douglas Abrams, the internationally bestselling co-author of The Book of Joy, explore through intimate and thought-provoking dialogue one of the most sought after and least understood elements of human nature: hope. In The Book of Hope, Jane focuses on her "Four Reasons for Hope": The Amazing Human Intellect, The Resilience of Nature, The Power of Young People, and The Indomitable Human Spirit...', 4.5),
        createBook(9780593298299, 'Believing', 'Anita Hill', 30, 25.49, '“An elegant, impassioned demand that America see gender-based violence as a cultural and structural problem that hurts everyone, not just victims and survivors… It\'s at times downright virtuosic in the threads it weaves together.”—NPR\n\nFrom the woman who gave the landmark testimony against Clarence Thomas as a sexual menace, a new manifesto about the origins and course of gender violence in our society; a combination of memoir, personal accounts, law, and social analysis, and a powerful call to arms from one of our most prominent and poised survivors.', 5),
        createBook(9781982168018, 'Taste', 'Stanley Tucci', 28, 22.49, 'A delightful memoir by the actor and star of the CNN series: Stanley Tucci: Searching for Italy. Food has always been an important part of his life, playing a role in various key moments in his personal and professional career. With a few Italian cookbooks under his belt, it\'s clear this is more than just a hobby to Tucci. With great wit and warmth, this memoir is a wonderful read that makes fans love him even more.', 2.25),
        createBook(9780593231524, 'Midnight in Washington', 'Adam Schiff', 30, 0, 'From the congressman who led the first impeachment of Donald J. Trump, the vital inside account of American democracy in its darkest hour, and a warning that the forces of autocracy unleashed by Trump remain as potent as ever.\n\n“If there is still an American democracy fifty years from now, historians will be very grateful for this highly personal and deeply informed guide to one of its greatest crises. We should be grateful that we can read it now.”—Timothy Snyder, #1 New York Times bestselling author of On Tyranny', 4),
        createBook(9780063002609, 'The Forever Dog', 'Rodney Habib, Karen Shaw Becker', 28.99, 24.49, 'In this pathbreaking guide, two of the world’s most popular and trusted pet care advocates reveal new science to teach us how to delay aging and provide a long, happy, healthy life for our canine companions.', 3.5),
        createBook(9781338790238, 'The Christmas Pig', 'J. K. Rowling, Jim Field (Illustrator)', 24.49, 17.49, 'This sweet story of a boy and his favorite toy is a rollicking adventure from start to finish. When Jack’s favorite toy, Dur Pig, goes missing, he teams up with DP’s replacement, the Christmas Pig, on the adventure of a lifetime to find him — all on Christmas Eve, of course. This clever tale is sure to bring a smile to readers of all ages who have ever wondered where things go when they go missing.', 2.75),
        createBook(9781541647534, 'The Dying Citizen', 'Victor Davis Hanson', 30, 23.99, 'The New York Times bestselling author of The Case for Trump explains the decline and fall of the once cherished idea of American citizenship.\n\nHuman history is full of the stories of peasants, subjects, and tribes. Yet the concept of the “citizen” is historically rare—and was among America’s most valued ideals for over two centuries. But without shock treatment, warns historian Victor Davis Hanson, American citizenship as we have known it may soon vanish.', 4.5),
        createBook(9780063065246, 'The Boys', 'Ron and Clint Howard, Ron Howard, Clint Howard', 28.99, 22.99, 'Ron and Clint Howard, the former being the famous actor and director and the latter, a character actor living in the shadow of his brother, openly and repeatedly credit their father and mother, Rance and Jean, as the reason for their success. Rance, especially, is the hero of the book. He wanted to make it big in Hollywood but saw the early success of his kids and deferred his dreams to mentor his boys. Together, Ron and Clint\'s parents gave them the steady foundation they needed to fulfill their Hollywood destiny.'),
        createBook(9780593490594, 'Silverview', 'John le Carré', 28, 19.6, 'John le Carré originally started this book in 2014 and then put it aside to work on his memoir The Pigeon Tunnel. Lucky for us, it was indeed finished and put into safe keeping. Our world stands to always need more of John le Carré’s world.'),
        createBook(9780063076099, 'The Storyteller', 'Dave Grohl', 29.99, 23.99, 'This book may have never happened if the pandemic didn\'t force everyone indoors and into isolation for several months. Dave Grohl, the twice-inducted Rock & Roll Hall of Fame member for his work with Nirvana and the Foo Fighters, decided to tell stories about his life and music on social media. From there, the stories on social media began to coalesce into a whole which made a book possible. He has lived through and seen a lot, so these tales run the gamut from the halcyon Nirvana days, up to the present as a Foo Fighter. Clearly, this is a great fan book but it\'s also an amazing look at the grunge movement and the rock scene from the 80s and beyond.', 5),
        createBook(9781974720149, 'Jujutsu Kaisen 0', 'Gege Akutami', 9.99, 0, 'In a world where cursed spirits feed on unsuspecting humans, fragments of the legendary and feared demon Ryomen Sukuna were lost and scattered about. Should any demon consume Sukuna’s body parts, the power they gain could destroy the world as we know it. Fortunately, there exists a mysterious school of Jujutsu Sorcerers who exist to protect the precarious existence of the living from the supernatural!', 5),
        createBook(9780316321969, 'Kingdom of the Cursed', 'Kerri Maniscalco', 18.99, 14.99, 'In this stunning sequel to Kingdom of the Wicked, Emilia journeys to the Seven Circles on her quest to avenge the death of her sister, Vittoria. Luxe world-building, dark magic, and twists and turns on every page make this follow-up just as enthralling as its predecessor.', 5),
        createBook(9781338139082, 'The Koala Who Could', 'Rachel Bright, Jim Field (Illustrator)', 16.99, 14.99, 'Sometimes a little CHANGE can open your world to BIG possibilities.\nYou see, high-up was safe since he liked a slow pace,While the ground down below seemed a frightening place.Too fast and too loud and too big and too strange.Nope. Kevin preferred not to move or to change.Kevin the koala loves every day to be the same, where it\'s snug and safe. But when change comes along, will Kevin embrace all the joys that come with trying something new?An inspiring rhyming read aloud by bestselling Love Monster creator Rachel Bright and Frog on a Log? illustrator Jim Field that empowers young readers to face change with courage and delight.', 5),
    ];
    saveToStorage(KEY, demo);
    return demo;
}


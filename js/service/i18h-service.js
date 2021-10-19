'use strict';

var gLang = 'en';

var gTrans = {
    id: {
        en: 'ID',
        he: 'מק"ט',
    },
    title: {
        en: 'Title',
        he: 'כותרת',
    },
    price: {
        en: 'Price',
        he: 'מחיר',
    },
    sale: {
        en: 'Sale',
        he: 'מבצע',
    },
    rate: {
        en: 'Rate',
        he: 'דירוג',
    },
    sort: {
        en: 'Sort',
        he: 'מיון',
    },
    filters: {
        en: 'Filter',
        he: 'סינון',
    },
    author: {
        en: 'Author',
        he: 'מחבר',
    },
    desc: {
        en: 'Description',
        he: 'תיאור',
    },
    edit: {
        en: 'Edit',
        he: 'ערוך',
    },
    update: {
        en: 'Update',
        he: 'עדכן',
    },
    add: {
        en: 'Add',
        he: 'הוסף',
    },
    read: {
        en: 'Read',
        he: 'תצוגה',
    },
    remove: {
        en: 'Remove',
        he: 'הסר',
    },
    cover: {
        en: 'Cover',
        he: 'תמונה',
    },
    action: {
        en: 'Action',
        he: 'פעולה',
    },
}

function setLanguage(lang) {
    if (lang) gLang = lang;
}

function getTranslated(key, lang = gLang) {
    return gTrans[key][lang];
}

function getCurrency(lang = gLang) {
    switch (lang) {
        case 'he': return 'ILS';
        default: return 'USD';
    }
}

function convertCurreny(number, currency = getCurrency(), language = gLang) {
    return new Intl.NumberFormat(language, { style: 'currency', currency }).format(number);
}

function getLanguage() {
    return gLang;
}

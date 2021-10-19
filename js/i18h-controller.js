'use strict';

function onSetLang(lang) {
    setLanguage(lang);
    setLanguageDirection(lang);
    var elTranslate = document.querySelectorAll('[data-trans]');
    elTranslate.forEach(el => {
        el.innerText = getTranslated(el.dataset.trans);
    });
    renderBooks();
    renderControls();
}

function setLanguageDirection(lang) {
    var elBody = document.querySelector('body');
    switch (lang) {
        case 'he':
            elBody.style.direction = 'rtl';
            break;
        default:
            elBody.style.direction = '';
            break;
    }
}

function isInterfaceRTL() {
    var elBody = document.querySelector('body').style.direction;
    return (elBody === 'rtl') ? true : false;
}
'use strict'

function saveMemesToStorage() {
    saveToStorage('savedMemesDB', gSavedMemes)
}

function saveToStorage(key, value) {
    const str = JSON.stringify(value)
    localStorage.setItem(key, str)
}

function loadFromStorage(key) {
    const str = localStorage.getItem(key)
    return JSON.parse(str)
}
'use strict'

function onInit() {
    console.log('onGalleryInit')
    renderKeywords()
    renderImages()
}

//refresh index - default is gallery
function onGalleryInit() {
    window.location.reload()
}

function hideGallery() {
    document.querySelector('.gallery-container').classList.add('display-none')
    document.querySelector('.gallery-link').classList.remove('focused')
}

function renderKeywords() {
    const keywords = getKeywords();
    const strHTMLs = keywords.map(keyword => `<p class="keyword" id="${keyword}" onclick="renderImages(this.id)">${keyword}</p>`)
    document.querySelector('.keywords-container').innerHTML = strHTMLs.join('')
}

function renderImages(keyword) {
    const imgs = getImgsForDisplay(keyword)
    const strHTMLs = imgs.map((img, idx) => `<img src="${img.url}" onclick="onImgClicked(this)" class="meme-img" id="${img.id}" alt="Image ${idx + 1}">`)
    const msg = `No matches found.`
    document.querySelector('.gallery').innerHTML = (imgs.length)? strHTMLs.join('') : msg
}

function toggleMenu() {
    document.querySelector('.main-nav').classList.toggle('menu-open')
    document.querySelector('.main-screen').classList.toggle('menu-open')
}
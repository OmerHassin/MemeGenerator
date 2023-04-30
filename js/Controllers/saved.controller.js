'use strict'

function onSavedInit() {
    hideGallery()
    hideEditor()
    hideAbout()
    showSavedMemes()
    renderSavedMemes()
    document.querySelector('.main-nav').classList.remove('menu-open')
    document.querySelector('.main-screen').classList.remove('menu-open')
}

function onDeleteMeme(memeId) {
    deleteSavedMeme(memeId)
    renderSavedMemes()
}

function showSavedMemes() {
    document.querySelector('.saved-container').classList.remove('display-none')
    document.querySelector('.saved-link').classList.add('focused')
}

function hideSavedMemes() {
    document.querySelector('.saved-container').classList.add('display-none')
    document.querySelector('.saved-link').classList.remove('focused')
}

function renderSavedMemes() {
    const memes = getSavedMemes()

    const strHTMLs = memes.map((meme) => {
        return `<div class="saved-meme">
        <img src="${meme.src}" id="${meme.id}" onclick="onImgClicked(this)" class="meme-img" alt="meme-img">
        <button class="btn-delete-meme" onclick="onDeleteMeme('${meme.id}')"><i class="far fa-trash-alt"></i></button>
        </div>`
    })

    const msg =`no saved memes`

    document.querySelector('.saved-memes').innerHTML = (memes.length) ? strHTMLs.join('') : msg
}
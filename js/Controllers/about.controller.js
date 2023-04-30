'use strict'

function onAboutInit() {
    hideGallery()
    hideEditor()
    hideSavedMemes()
    showAbout()
    document.querySelector('.main-nav').classList.remove('menu-open')
    document.querySelector('.main-screen').classList.remove('menu-open')
}

function showAbout() {
    document.querySelector('.about-container').classList.remove('display-none')
    document.querySelector('.about-link').classList.add('focused')
}

function hideAbout() {
    document.querySelector('.about-container').classList.add('display-none')
    document.querySelector('.about-link').classList.remove('focused')
}
'use strict'

const NUM_OF_IMG = 18

const gImgs = _createImgs()
const gKeywords = _createKeywords()
const gKeywordSearchCountMap = _createKeywordSearchCountMap()

function getImgById(id) {
    return gImgs.find(img => img.id === id)
}

function getImgsForDisplay(keyword) {
    if (!keyword) return gImgs
    return gImgs.filter(img => {
        //gets a subpattern and case insensitive
        const pattern = new RegExp(keyword, "i")
        return img.keywords.find(keyword => keyword.match(pattern))
    })
}

function getKeywords() {
    return gKeywords
}

// private functions

function _createImgs() {
    const imgs = []
    for (var i = 1; i <= NUM_OF_IMG; i++) {
        const img = {
            id: i,
            url: `img/${i}.jpg`,
            keywords: (i % 3 === 0) ? ['funny', 'nba'] : ['funny', 'trump']
        }

        imgs[i] = img
    }

    return imgs.slice(1)
}

function _createKeywords() {
    return ['trump', 'funny', 'dog', 'sad', 'NBA']
}

function _createKeywordSearchCountMap() {
    return gKeywords.reduce((acc, keyword) => {
        acc[keyword] = 0
        return acc}, {})
}
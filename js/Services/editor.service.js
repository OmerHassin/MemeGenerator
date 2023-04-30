'use strict'

const STORAGE_KEY = 'savedMemesDB'

var gMeme
var gCanvasWidth
var gCanvasHeight
var gSavedMemes = _createSavedMemes()

// SAVED MEMES
function deleteSavedMeme(memeId) {
    const idx = gSavedMemes.findIndex(meme => meme.id === memeId)
    
    gSavedMemes.splice(idx, 1)
    saveMemesToStorage()
}

function saveMeme(dataURL) {
    const idx = gSavedMemes.findIndex(meme => meme.id === gMeme.id)
    
    if (idx !== -1) {
        gSavedMemes[idx].src = dataURL
    } else {
        const savedMeme = gMeme
        savedMeme.src = dataURL
        savedMeme.id = getRandomId()
        gSavedMemes.push(savedMeme)
    }
    saveMemesToStorage()
}

function getSavedMemes() {
    return gSavedMemes
}

//Line Manipulations
function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function addLine() {
    gMeme.isLineSelected = true
    const pos = { x: gCanvasWidth / 2, y: gCanvasHeight / 2 }
    gMeme.lines.push(_createLineObject(pos))
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function removeSelectedLine() {
    if (gMeme.lines.length === 0 || !gMeme.isLineSelected) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 
        (gMeme.selectedLineIdx > 0) ? gMeme.selectedLineIdx - 1 : 0
}

function switchLine(idx) {
    setIsLineSelected(true)
    gMeme.selectedLineIdx = (idx >= 0) ? idx : (gMeme.selectedLineIdx + 1) % gMeme.lines.length
    // console.log(`Selected line ${gMeme.selectedLineIdx}`)
}

function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function isLineClicked(pos) {
    return gMeme.lines.findIndex(line => {
        const { xStart, xEnd, yStart, yEnd } = line.borders
        return ((pos.offsetX >= xStart && pos.offsetX <= xEnd) && (pos.offsetY >= yStart && pos.offsetY <= yEnd))
    })
}

function setLineDrag(isDragable) {
    if (gMeme.lines.length === 0) return
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDragable
}

function setIsLineSelected(isSelected) {
    gMeme.isLineSelected = isSelected
}

function setLineBorders(properties, idx) {
    const { xStart, yStart, xEnd, yEnd } = properties
    gMeme.lines[idx].borders = { xStart, xEnd: xStart + xEnd, yStart, yEnd: yStart + yEnd }
}

function getLineSelectionBorders(idx) {
    const line = gMeme.lines[idx]
    const width = gCtx.measureText(line.txt).width
    const height = line.size
    const yStart = line.pos.y - height
    const xEnd = width + (height / 5)
    const yEnd = height + (height / 5)
    var xStart

    switch (line.align) {
        case 'center':
            xStart = line.pos.x - width / 2
            break
        case 'start':
            xStart = line.pos.x
            break
        case 'end':
            xStart = line.pos.x - width
            break
        default:
            xStart = line.pos.x - width / 2
            break
    }

    return { xStart, yStart, xEnd, yEnd }
}

//Editor Buttons
function setFontSize(change) {
    if (!gMeme.isLineSelected) return
    switch (change) {
        case 1:
            gMeme.lines[gMeme.selectedLineIdx].size++
            break
        case -1:
            gMeme.lines[gMeme.selectedLineIdx].size--
            break
    }
}

function setAlignText(direction) {
    if (!gMeme.isLineSelected) return
    gMeme.lines[gMeme.selectedLineIdx].align = direction
    switch (direction) {
        case 'start':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = 0
            break
        case 'end':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = gCanvasWidth
            break
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].pos.x = gCanvasWidth / 2
            break
    }
}

function setFontFamily(fontFamily) {
    if (!gMeme.isLineSelected) return
    gMeme.lines[gMeme.selectedLineIdx].font = fontFamily
}

function setStrokeColor(color) {
    if (!gMeme.isLineSelected) return
    gMeme.lines[gMeme.selectedLineIdx].stroke = color
}

function setFillColor(color) {
    if (!gMeme.isLineSelected) return
    gMeme.lines[gMeme.selectedLineIdx].fill = color
}

function addSticker(sticker) {
    gMeme.isLineSelected = true
    gMeme.lines.push({
        txt: sticker,
        size: 60,
        pos: { x: gCanvasWidth / 2, y: gCanvasHeight / 2 },
        isDrag: false
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

//Misc
function getMeme() {
    return gMeme
}

function createMeme(ImgId) {
    if(_checkIfSavedMeme(ImgId)) return
    const firstLinePos = { x: gCanvasWidth / 2, y: gCanvasHeight * 0.2 }
    const SecondLinePos = { x: gCanvasWidth / 2, y: gCanvasHeight * 0.8 }

    gMeme = {
        selectedImgId: ImgId,
        selectedLineIdx: 0,
        isLineSelected: true,
        lines: [
            _createLineObject(firstLinePos),
            _createLineObject(SecondLinePos)
        ]
    }
}

function setCanvasSize() {
    gCanvasWidth = gElCanvas.width
    gCanvasHeight = gElCanvas.height

    if (gMeme) _renderMeme()
}

//private functions
function _createSavedMemes() {
    var savedMemes = loadFromStorage(STORAGE_KEY)

    if (!savedMemes || savedMemes.length === 0) {
        savedMemes = []
        saveToStorage(STORAGE_KEY, savedMemes)
    }

    return savedMemes
}

function _createLineObject(pos) {
    return {
        txt: 'Enter text here',
        font: 'impact',
        size: 40,
        align: 'center',
        stroke: 'black',
        fill: 'white',
        pos,
        isDrag: false
    }
}

function _checkIfSavedMeme(ImgId) {
    if (ImgId.charAt(0) === '$') {
        gMeme = gSavedMemes.find(meme => meme.id === ImgId)
        return true
    }

    return false
}
'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

var gElCanvas
var gCtx
var gStartPos

function onImgClicked(elImg) {
    hideGallery()
    hideSavedMemes()
    hideAbout()
    _showEditor()
    _initCanvas()
    createMeme(elImg.id)
    _renderMeme()
}

function hideEditor() {
    document.querySelector('.editor-container').classList.add('display-none')
    document.querySelector('.editor-container').classList.remove('flex')
}

//Editor Buttons

function onSetFontSize(sizeDiff) {
    setFontSize(sizeDiff)
    _renderMeme()
}

function onSetAlignText(alignDirection) {
    setAlignText(alignDirection)
    _renderMeme()
}

function onSetFontFamily(fontFamily) {
    setFontFamily(fontFamily)
    _renderMeme()
}

function onSetStrokeColor(color) {
    setStrokeColor(color)
    _renderMeme()
}

function onSetFillColor(color) {
    setFillColor(color)
    _renderMeme()
}

function onAddSticker(sticker) {
    addSticker(sticker)
    _renderMeme()
}

//Share Download Save
function onSaveMeme() {
    _cleanSelections

    removeListeners()

    const dataURL = gElCanvas.toDataURL()
    saveMeme(dataURL)
    onSavedInit()
}

function onDownloadCanvas(elLink) {
    console.log('downloading')
    _cleanSelections()

    const data = gElCanvas.toDataURL()
    elLink.href = data
}

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
    _doUploadImg(imgDataUrl, onSuccess)
}

//Line Manipulations
function drawSelectedLineBorders(borders) {
    const { xStart, yStart, xEnd, yEnd } = borders
    gCtx.beginPath()
    gCtx.rect(xStart, yStart, xEnd, yEnd)
    gCtx.lineWidth = 3
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    gCtx.closePath()
}

function onRemoveLine() {
    removeSelectedLine()
    _renderMeme()
}

function onAddLine() {
    addLine()
    _renderMeme()
}

function onSwitchLine(idx) {
    switchLine(idx)
    _updateTextInput()
    _renderMeme()
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    _renderMeme()
}

//Event listeners
function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
        _resizeCanvas()
        _renderMeme()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('mousemove', onMove)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
    gElCanvas.addEventListener('touchmove', onMove)
}

function removeListeners() {
    gElCanvas.removeEventListener('mousemove', onMove)
    gElCanvas.removeEventListener('mousedown', onDown)
    gElCanvas.removeEventListener('mouseup', onUp)
    gElCanvas.removeEventListener('touchmove', onMove)
    gElCanvas.removeEventListener('touchstart', onDown)
    gElCanvas.removeEventListener('touchend', onUp)

    window.addEventListener('resize', _resizeCanvas)
    window.addEventListener('resize', _renderMeme)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    //returns -1 if no line was clicked
    const lineIdx = isLineClicked(pos) 

    if (lineIdx === -1) {
        setIsLineSelected(false)
        _renderMeme()
        return
    } else {
        onSwitchLine(lineIdx)
        setLineDrag(true)
    }
    gStartPos = pos
    gElCanvas.style.cursor = 'grabbing'
}

function onMove(ev) {
    const line = getLine()
    if (!line || !line.isDrag) return

    const pos = getEvPos(ev)
    // Calc the delta , the diff we moved
    const dx = pos.offsetX - gStartPos.offsetX
    const dy = pos.offsetY - gStartPos.offsetY
    if (line.isDrag) {
        moveLine(dx, dy)
    }
    gStartPos = pos
    _renderMeme()
}

function onUp() {
    setLineDrag(false)
    gElCanvas.style.cursor = 'grab'
}

function getEvPos(ev) {
    // Gets the offset pos , the default pos
    let pos = {
        offsetX: ev.offsetX,
        offsetY: ev.offsetY
    }
    console.log('pos:', pos)
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
         //Calc the right pos according to the touch screen
        console.log('ev.pageX:', ev.pageX)
        console.log('ev.pageY:', ev.pageY)
        const boundingClientRect = ev.target.getBoundingClientRect();
        pos = {
            offsetX: ev.pageX - boundingClientRect.left,
            offsetY: ev.pageY - boundingClientRect.top
        }
        console.log(ev.pageX - boundingClientRect.left);
        console.log(ev.pageY - boundingClientRect.top);
    }
    
    return pos
}

// private functions
function _showEditor() {
    document.querySelector('.editor-container').classList.remove('display-none')
    document.querySelector('.editor-container').classList.add('flex')
}

function _initCanvas() {
    gElCanvas = document.querySelector('canvas')
    _resizeCanvas()

    gCtx = gElCanvas.getContext('2d')
    addListeners()
}

function _resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = gElCanvas.width
    setCanvasSize()
}

function _renderMeme() {
    const meme = getMeme()
    const {selectedImgId, lines} = meme

    const elImg = document.getElementById(`${selectedImgId}`)
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

    _updateTextInput()
    _drawLines(lines, meme)
}

function _updateTextInput() {
    const meme = getMeme()
    const instructionMsg = 'Hit + to add a new line'
    const txt = (meme.lines.length) ? meme.lines[meme.selectedLineIdx].txt : instructionMsg
    document.querySelector('.text-line-input').value = txt
}

function _drawLines(lines, meme) {
    lines.forEach((line, idx) => {
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.textAlign = line.align
        gCtx.fillStyle = line.fill
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)
        gCtx.lineWidth = 1
        gCtx.strokeStyle = line.stroke
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y)

        const lineBorders = getLineSelectionBorders(idx)
        setLineBorders(lineBorders, idx)

        if (idx === meme.selectedLineIdx && meme.isLineSelected) drawSelectedLineBorders(lineBorders)
    })
}

function _doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function _cleanSelections() {
    // avoid line selections showing in meme
    gMeme.isLineSelected = false
    _renderMeme()
}
'use strict'

// Returns a random id of letters/digits.
function getRandomId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var id = '$'

    for (var i = 0; i < length - 1; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return id
}

// Returns a random integer between the min - max range
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

/////

//modals
function flashMsg(msg) {
    $('.user-msg').text(msg)
    $('.user-msg').addClass('open')
    setTimeout(() => {
        $('.user-msg').removeClass('open')
    }, 3000)
}

//css
// .user-msg {
//     position: fixed;
//     bottom: -100px;
//     right: 10px;
//     background-color: hsl(160, 78%, 50%);
//     padding: 10px;
//     transition: bottom 0.5s;
//   }
  
//   .user-msg.open {
//     bottom: 10px;
//   }
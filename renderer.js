// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

let lastMsgId = 0

window.quitAndInstall = function () {
    electron.remote.autoUpdater.quitAndInstall()
}

ipcRenderer.on('console', (event, consoleMsg) => {
    console.log(consoleMsg)
})

ipcRenderer.on('message', (event, data) => {
    // showMessage(data.msg, data.hide, data.replaceAll)
    console.log('message', data.msg)
})

function showMessage(message, hide = true, replaceAll = false) {
    const messagesContainer = document.querySelector('.messages-container')
    const msgId = lastMsgId++ + 1
    const msgTemplate = `<div id="${msgId}" class="alert alert-info alert-info-message animated fadeIn">${message}</div>`

    if (replaceAll) {
        messagesContainer.innerHTML = msgTemplate
    } else {
        messagesContainer.insertAdjacentHTML('afterbegin', msgTemplate)
    }

    if (hide) {
        setTimeout(() => {
            const msgEl = document.getElementById(msgId)
            msgEl.classList.remove('fadeIn')
            msgEl.classList.add('fadeOut')
        }, 4000)
    }
}
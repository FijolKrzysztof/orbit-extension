const startButton = document.getElementById('startButton')
const backButton = document.getElementById('backButton')
const layButton = document.getElementById('layButton')
const previousButton = document.getElementById('previousButton')
const nextButton = document.getElementById('nextButton')
const initialStartButton = document.getElementById('initialStartButton')
const messageBox = document.getElementById('messageBox')

let tab;

(async function () {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
})()

let state;
let elem;
let maxElem = 1000;

startButton.addEventListener('click', () => {
    chrome.tabs.sendMessage(tab.id, {start: true}, (response) => {
        createMessage(response)
        startButton.disabled = true
    });
})

initialStartButton.addEventListener('click', () => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['background.js'],
    }, () => {
        nextButton.disabled = false
        previousButton.disabled = false
        initialStartButton.disabled = true
    })
})

previousButton.addEventListener('click', () => {
    if (typeof elem !== 'number') { elem = 1 }
    if (elem > 0) {
        elem --

        chrome.tabs.sendMessage(tab.id, {next: {elem, type: state}}, (response) => {
            createMessage(response)
            startButton.disabled = false
        });
    } else {
        createMessage('ERROR: no more elements')
    }
})

nextButton.addEventListener('click', () => {
    if (typeof elem !== 'number') { elem = -1 }
    if (elem < maxElem) {
        elem++

        chrome.tabs.sendMessage(tab.id, {next: {elem, type: state}}, (response) => {
            if (typeof response === 'number') {
                maxElem = response
                elem --;
                createMessage('new maxElem: ' + response)
            } else {
                createMessage(response)
                startButton.disabled = false
            }
        });
    } else {
        createMessage('ERROR: no more elements')
    }
})

backButton.addEventListener('click', () => {
    state = 1
    backButton.style.backgroundColor = 'lightblue'
    layButton.style.backgroundColor = 'wheat'
    initialStartButton.disabled = false
})

layButton.addEventListener('click', () => {
    state = 0
    layButton.style.backgroundColor = 'red'
    backButton.style.backgroundColor = 'wheat'
    initialStartButton.disabled = false
})

function createMessage(message){
    const div = document.createElement('div');
    const date = new Date();
    div.innerText = message + ' : '
        + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    div.style.whiteSpace = 'nowrap'
    messageBox.appendChild(div)
}

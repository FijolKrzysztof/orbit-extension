const startButton = document.getElementById('startButton')
const backButton = document.getElementById('backButton')
const layButton = document.getElementById('layButton')
const previousButton = document.getElementById('previousButton')
const nextButton = document.getElementById('nextButton')
const initialStartButton = document.getElementById('initialStartButton')
const messageBox = document.getElementById('messageBox')

let tab;
let state;
let elem;
let maxElem = 1000;

(async function () {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, {initialStart: true}, (response) => {
        if (response) {
            chrome.storage.local.get(['initialStart'], (data) => {
                if (data?.initialStart) {
                    data.initialStart?.state ? setBackState() : setLayState()
                    setInitialStart()
                }
            })
            chrome.storage.local.get(['elem'], (data) => {
                if (data?.elem) {
                    elem = data.elem?.value
                }
            })
        }
    });
})()

startButton.addEventListener('click', () => {
    chrome.tabs.sendMessage(tab.id, {start: true}, (response) => {
        createMessage(response)
        startButton.disabled = true
    });
})

initialStartButton.addEventListener('click', () => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['page.js'],
    }, () => {
        setInitialStart()
        chrome.storage.local.set({initialStart: {state}})
        state ? setBackState() : setLayState()
        nextButton.click()
    })
})

previousButton.addEventListener('click', () => {
    if (typeof elem !== 'number') { elem = 1 }
    if (elem > 0) {
        elem --

        chrome.tabs.sendMessage(tab.id, {next: {elem, type: state}}, (response) => {
            chrome.storage.local.set({elem: {value: elem}})
            createMessage(response)
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
                chrome.storage.local.set({elem: {value: elem}})
                createMessage(response)
            }
        });
    } else {
        createMessage('ERROR: no more elements')
    }
})

backButton.addEventListener('click', () => {
    setBackState()
})

layButton.addEventListener('click', () => {
    setLayState()
})

function setBackState() {
    state = 1
    backButton.style.backgroundColor = 'lightblue'
    layButton.style.backgroundColor = 'wheat'
    initialStartButton.disabled = false
}

function setLayState() {
    state = 0
    layButton.style.backgroundColor = 'red'
    backButton.style.backgroundColor = 'wheat'
    initialStartButton.disabled = false
}

function setInitialStart() {
    nextButton.disabled = false
    previousButton.disabled = false
    backButton.disabled = true
    layButton.disabled = true
    startButton.disabled = false
    setTimeout(() => {
        initialStartButton.disabled = true
    })

}

function createMessage(message){
    const div = document.createElement('div');
    const date = new Date();
    div.innerText = message + ' : '
        + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    div.style.whiteSpace = 'nowrap'
    messageBox.appendChild(div)
}

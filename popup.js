const startButton = document.getElementById('startButton')
const backButton = document.getElementById('backButton')
const layButton = document.getElementById('layButton')
const oddsInput = document.getElementById('oddsInput')
const tickInput = document.getElementById('tickInput')
const messageBox = document.getElementById('messageBox')

let state;

startButton.addEventListener('click', async() => {
    if (typeof state !== "number" || !oddsInput.value || !tickInput.value) {
        appendMessage('ERROR: could not start')

    } else {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['background.js'],
        });

        const initialData = {type: state, odds: oddsInput.value, tick: tickInput.value}

        setTimeout(() => {

            chrome.runtime.sendMessage({initialData: initialData}, function (response){
                console.log(response)
                createMessage('started')
                startButton.disabled = true
            });
        }, 2000)
    }

})

backButton.addEventListener('click', () => {
    state = 1
    backButton.style.backgroundColor = 'lightblue'
    layButton.style.backgroundColor = 'wheat'
})

layButton.addEventListener('click', () => {
    state = 0
    layButton.style.backgroundColor = 'red'
    backButton.style.backgroundColor = 'wheat'
})

function appendMessage(message){
    const div = document.createElement('div');
    div.innerText = createMessage(message)
    div.style.whiteSpace = 'nowrap'
    messageBox.appendChild(div)
}

function createMessage(message) {
    const date = new Date();
    return message + ' : ' + date.getHours() + ':' + date.getMinutes()
}

chrome.storage.sync.get("color", ({ color }) => {
    messageBox.innerText = color;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if ('text' in request) {
        messageBox.innerText = request.text
        sendResponse('text: received')
    }
    // if (sender.tab && request.greeting == "hello")
    //     sendResponse({farewell: "goodbye"});
    // else
    //     sendResponse({}); // snub them.
});

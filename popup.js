const startButton = document.getElementById('startButton')
const backButton = document.getElementById('backButton')
const layButton = document.getElementById('layButton')
const previousButton = document.getElementById('previousButton')
const nextButton = document.getElementById('nextButton')
const tickInput = document.getElementById('tickInput')
const messageBox = document.getElementById('messageBox')

let state;
let elem = 0;

startButton.addEventListener('click', async() => {
    if (typeof state !== "number" || !tickInput.value || typeof elem !== 'number') {
        appendMessage('ERROR: could not start')

    } else {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.storage.local.set({
            initialData: {type: state, tick: tickInput.value, elem}
        }, () => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['background.js'],
            }, () => {
                chrome.tabs.sendMessage(tab.id, {scriptOptions: {param1:'value1',param2:'value2'}}, function(){
                    //all injected
                });
                createMessage('started')
                startButton.disabled = true
            })
        });
    }
})

previousButton.addEventListener('click', () => {

})

nextButton.addEventListener('click', () => {

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
    return message + ' : '
        + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    // if ('text' in request) {
    //     messageBox.innerText = request.text
    //     sendResponse('text: received')
    // }
    // if (sender.tab && request.greeting == "hello")
    //     sendResponse({farewell: "goodbye"});
    // else
    //     sendResponse({}); // snub them.
});

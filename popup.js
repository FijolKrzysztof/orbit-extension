const messageBox = document.getElementById('messageBox')
const startButton = document.getElementById('startButton')
startButton.addEventListener('click', async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
})

function setPageBackgroundColor() {
    const data = document.getElementById('locate_logs').textContent
    console.log(data)
    chrome.runtime.sendMessage({text: data}, function (response){
        console.log(response)
    });

    // chrome.storage.sync.get("color", ({ color }) => {
    //     document.body.style.backgroundColor = color;
    // });
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

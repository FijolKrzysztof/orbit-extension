// const blueCell = document.getElementsByClassName('js-blue-cell')

// console.log(blueCell)

// chrome.runtime.sendMessage({text: data}, function (response){
//     console.log(response)
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    console.log('received')
    if ('initialData' in request) {
        type = request.initialData.type;
        odds = request.initialData.odds;
        tick = request.initialData.tick;
        sendResponse('initialData: received')
        listenForChange(type, odds, tick)
    }
});

function listenForChange(type, odds, tick) {
    console.log(type, odds, tick)
}

// const blueCell = document.getElementsByClassName('js-blue-cell')

// console.log(blueCell)

// chrome.runtime.sendMessage({text: data}, function (response){
//     console.log(response)
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    console.log('received')
    if ('initialData' in request) {
        type = request.initialData.type;
        tick = request.initialData.tick;
        sendResponse('initialData: received')
        listenForChange(type, odds, tick)
    }
});

chrome.storage.local.get('initialData', (items) => {
    type = items.initialData.type
    tick = items.initialData.tick
    elem = items.initialData.elem

    odds = document.getElementsByClassName('js-price')[0].value
    targetClassName = type ? 'js-blue-cell' : 'js-green-cell'

    setInterval(() => {
       target = document.getElementsByClassName(targetClassName)[elem].children[0].children[0].children[0].children[0]

        if (type && odds <= target.textContent || !type && odds <= target.textContent) {

        }
    }, 1000)
});

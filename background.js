let current

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    if ('start' in request) {
        const priceElems = document.getElementsByClassName('js-price');

        if (!priceElems.length) {
            sendResponse('ERROR: no closing bet')
        } else {
            sendResponse('started')

            setInterval(() => {
                const odds = priceElems[0].value
                const target = document.getElementsByClassName(current.targetClassName)[current.elem].children[0].children[0].children[0].children[0]

                if (current.targetClassName === 'js-blue-cell' && odds <= target.textContent
                    || current.targetClassName === 'js-green-cell' && odds <= target.textContent) {

                }
            }, 1000)
        }
    }

    if ('next' in request) {
        const elem = request.next.elem
        const type = request.next.type

        const targetClassName = type ? 'js-blue-cell' : 'js-green-cell'

        try {
            const target = document.getElementsByClassName(targetClassName)[elem]
            target.style.border = '2px solid black'

            if (current) {
                const prevTarget = document.getElementsByClassName(current.targetClassName)[current.elem]
                prevTarget.style.border = ''
            }

            current = {elem, targetClassName}

            sendResponse('next: received')
        } catch (err) {
            sendResponse(elem - 1)
        }
    }
});

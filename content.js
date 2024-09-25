chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'changeFont') {
        const { fontFamily, fontStyle } = request.data;
        const elements = document.querySelectorAll('body, body *'); // Apply styles to the entire webpage

        elements.forEach(element => {
            element.style.fontFamily = fontFamily;
            element.style.fontWeight = fontStyle.includes('700') ? '700' : '400';
            element.style.fontStyle = fontStyle.includes('italic') ? 'italic' : 'normal';
        });
    }

    if (request.action === 'resetFont') {
        const elements = document.querySelectorAll('body, body *');
        elements.forEach(element => {
            element.style.fontFamily = '';
            element.style.fontWeight = '';
            element.style.fontStyle = '';
        });
    }
});

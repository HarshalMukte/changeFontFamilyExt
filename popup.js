document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    const fontSelect = document.getElementById('font-select');
    const fontOptions = document.getElementById('font-options');
    const selectedFont = document.getElementById('selected-font');
    const styleSelect = document.getElementById('style-select');
    const styleOptions = document.getElementById('style-options');
    const selectedStyleName = document.getElementById('selected-style');
    let selectedStyle = "";
    const domainName = document.getElementById('domain-name');
    const fontDropdownIcon = document.getElementById('font-dropdown-icon');
    const styleDropdownIcon = document.getElementById('style-dropdown-icon');

    // List of working fonts
    const fonts = [
        'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
        'Trebuchet MS', 'Open Sans', 'cursive', 'fantasy', 'monospace', 'Roboto', 'Montserrat'
    ];

    // Populate the custom dropdown with font options
    fonts.forEach(font => {
        const option = document.createElement('div');
        option.className = 'font-option';
        option.textContent = font;
        option.style.fontFamily = font; // Apply font style to the option
        fontOptions.appendChild(option);
    });

    // Show/Hide the font dropdown on click
    fontSelect.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up
        fontOptions.classList.toggle('show'); // Toggle the dropdown visibility
        styleOptions.classList.remove('show');
        fontDropdownIcon.style.transform = fontOptions.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)'; // Rotate the dropdown icon
    });

    // Show/Hide the style dropdown on click
    styleSelect.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up
        styleOptions.classList.toggle('show'); // Toggle the dropdown visibility
        fontOptions.classList.remove('show');
        styleDropdownIcon.style.transform = styleOptions.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)'; // Rotate the dropdown icon
    });

    // Hide dropdowns when clicking outside of them
    document.addEventListener('click', (event) => {
        if (!fontSelect.contains(event.target)) {
            fontOptions.classList.remove('show');
            fontDropdownIcon.style.transform = 'rotate(0deg)'; // Reset the dropdown icon
        }
        if (!styleSelect.contains(event.target)) {
            styleOptions.classList.remove('show');
            styleDropdownIcon.style.transform = 'rotate(0deg)'; // Reset the dropdown icon
        }
    });

    fontOptions.querySelectorAll('.font-option').forEach((option) => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from propagating  
            selectedFont.textContent =  option.textContent; // Set selected font in the custom select box
            selectedFont.style.fontFamily =  option.textContent; // Apply the selected font style
            styleOptions.classList.remove('show'); // Hide the dropdown with opacity and pointer-events
            fontOptions.classList.remove('show'); // Hide the dropdown with opacity and pointer-events
            fontDropdownIcon.style.transform = 'rotate(0deg)'; // Reset the dropdown icon
            applyFontChange(); // Apply font change to the webpage
        });
    })

    // Populate the style dropdown with options
    styleOptions.querySelectorAll('.style-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from propagating  
            selectedStyle = option.dataset.fontValue; // Set selected style in the custom select box
            selectedStyleName.textContent = option.textContent; // Set selected style in the custom select box
            styleOptions.classList.remove('show'); // Hide the dropdown with opacity and pointer-events
            fontOptions.classList.remove('show'); // Hide the dropdown with opacity and pointer-events
            styleDropdownIcon.style.transform = 'rotate(0deg)'; // Reset the dropdown icon
            applyFontChange(); // Apply style change to the webpage
        });
    });

    // Set domain name in header
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url);
        domainName.textContent = url.hostname;
    });

    // Event listener for the reset button
    resetBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Reset the font styles on the webpage
            chrome.tabs.sendMessage(tabs[0].id, { action: 'resetFont' });

            // Reset UI inputs
            selectedFont.textContent = 'Select Font';
            selectedFont.style.fontFamily = '';
            selectedStyleName.textContent = 'Select Style';
            selectedStyle = "";
        });
    });

    // Function to apply the font changes to the webpage
    function applyFontChange() {
        const fontFamily = selectedFont.textContent !== 'Select Font' ? selectedFont.textContent : '';
        const fontStyle = selectedStyle;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Send a message to the content script to change the font styles globally
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'changeFont',
                data: { fontFamily, fontStyle }
            });
        });
    }
});

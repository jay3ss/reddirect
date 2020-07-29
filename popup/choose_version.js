// Much of this taken from
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension

// Listen for clicks on the buttons and send the appropriate message to the
// content script in the page
let currentTab;


const listenForClicks = () => {
    document.addEventListener('click', (e) => {

        function updateTab(tabs) {
            if (tabs[0]) {
                currentTab = tabs[0];
            }
        }

        // redirect the page
        function reddirect(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: 'reddirect',
                url: currentTab.url,
                redditVersion: e.target.id
            });
        }

        const gettingActiveTab = browser.tabs.query({
            active: true,
            currentWindow: true
        });

        gettingActiveTab.then(updateTab);

        // log the error to the console
        function reportError(error) {
            console.error(`Could not reddirect: ${error}`);
        }


        // get the active tab
        // then redirect
        if (e.target.classList.contains('version')) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(reddirect)
                .catch(reportError);
        }
    });
}

// there was an error executing the script
// display the popup's error message & hide the normal UI
const reportExecuteScriptError = error => {
    document.querySelector('#popup-content').classList.add('hidden');
    document.querySelector('#error-content').classList.remove('hidden');
    console.error(`Failed to execute reddirect content script: ${error.message}`);
}

browser.tabs.executeScript({file: '/content_scripts/reddirect.js'})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);

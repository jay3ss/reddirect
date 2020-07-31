// Copyright © 2020 Jay Ess
// GNU General Public License v3.0
// <https://www.gnu.org/licenses/>

// All code from other sources, copyright belongs to it originator

// Much of this taken from
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension

var SUB_DOMAINS = {
    i: 'i.reddit.com',
    np: 'np.reddit.com',
    old: 'old.reddit.com',
    www: 'www.reddit.com'
};

(() => {
    // check and set a global guard variable
    // if this content script is injected into the same page again
    // it will do nothing the next time
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function reddirect(url, version) {
        const [host, pathname] = getHostAndPath(url);

        // make sure that this only activates on reddit
        const isReddit = host.split('.')[1] === 'reddit';
        if (isReddit) {
            const subdomain = SUB_DOMAINS[version];
            window.location.href = `https://${subdomain}${pathname}`;
        }
    }

    // listen for messages from the background script
    browser.runtime.onMessage.addListener(message => {
        if (message.command === 'reddirect') {
            reddirect(message.url, message.redditVersion);
        }
    });

})();

function getHostAndPath(url) {
    const a = document.createElement('a');
    a.href = url;
    return [a.hostname, a.pathname];
}

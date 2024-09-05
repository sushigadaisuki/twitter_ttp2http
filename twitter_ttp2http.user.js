// ==UserScript==
// @name         ttp2http
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  jerk off like a boss.
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

var ttp2http = () => {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walker.nextNode()) {
        if(node.nodeValue.match(/[^hH]ttp|^ttp/g)){
            node.nodeValue = node.nodeValue.replace(/[^hH]ttp|^ttp/g, 'http');
        }
    }
}
var url2clickable = () => {
    function getTextNodes(node) {
        let textNodes = [];
        const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (node.parentNode && node.parentNode.tagName !== 'A') {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }, false);
        let n;
        while (n = walk.nextNode()) {
            textNodes.push(n);
        }
        return textNodes;
    }
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
    const textNodes = getTextNodes(document.body);
    textNodes.forEach(node => {
        const text = node.nodeValue;
        if (urlPattern.test(text)) {
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let modified = false;
            text.replace(urlPattern, (url, index) => {
                modified = true;
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
                const a = document.createElement('a');
                a.href = url;
                a.textContent = url;
                a.target = '_blank';
                fragment.appendChild(a);

                lastIndex = index + url.length;
            });
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            if (modified) {
                node.parentNode.replaceChild(fragment, node);
            }
        }
    });
};

(function() {
    'use strict';
    setInterval(ttp2http ,1000);
    setInterval(url2clickable ,1000);
})();
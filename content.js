(function() {
    
    let currentUrl = window.location.href;

    function init() {
        // only run on the *.teamwork.com/app project page
        if (!window.location.href.includes('.teamwork.com/app')) {
            return;
        }

        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            // alert('URL changed');

            // remove the loaded class
            document.body.classList.remove('js-teamwork-copy-task-name-url-loaded');
        }


        // don't run if we have already loaded the elements
        if (document.body.classList.contains('js-teamwork-copy-task-name-url-loaded')) {
            return;
        }
    
        // alert('on the page')
        
        // wait until the page is loaded
        setTimeout(function() {
    
            // don't run if we have already loaded the elements
            if (document.body.classList.contains('js-teamwork-copy-task-name-url-loaded')) {
                return;
            }

            // applies to the legacy view iframe
            const iframe = document.querySelector('.tw-legacyViewWrapper');
    
            // iframe doesn't exist
            if (!iframe) {
                console.log('No iframe found with the class .tw-legacyViewWrapper');
                return;
            }
    
            // iframe does exist
            if (iframe) {
    
                // update the body class to indicate that we have the elements
                document.body.classList.add('js-teamwork-copy-task-name-url-loaded');

                const iframeDoc = iframe.contentWindow.document;
    
                function copyToClip(str) {
                    function listener(e) {
                      e.clipboardData.setData("text/html", str);
                      e.clipboardData.setData("text/plain", str);
                      e.preventDefault();
                    }
                    iframeDoc.addEventListener("copy", listener);
                    iframeDoc.execCommand("copy");
                    iframeDoc.removeEventListener("copy", listener);
                  };
    
                const clipboard = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" x="80" y="80" fill="none" alignment-baseline="middle" color="currentColor" viewBox="0 0 16 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M6.075 2.75H4.75a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h6.5a2 2 0 0 0 2-2v-7.5a2 2 0 0 0-2-2H9.925m-.04.275-.292 1.023A1.657 1.657 0 0 1 8 5.25v0c-.74 0-1.39-.49-1.593-1.202l-.293-1.023a1 1 0 0 1 .962-1.275h1.848a1 1 0 0 1 .962 1.275Z" /></svg>`
    
                // loop through all the tasks
                iframeDoc.querySelectorAll('.w-task-row:not(.w-task-row--fullpage) .w-task-row__name a').forEach(function(element, index) {
    
                    const taskUrl = element.href;
                    const taskName = element.innerText;
    
                    // create the rich text element
                    const richText = iframeDoc.createElement('a');
                    richText.setAttribute('href', taskUrl);
                    richText.textContent = taskName;
    
                    const richTextDiv = iframeDoc.createElement('div');
                    richTextDiv.appendChild(richText);
        
                    // create the button element
                    const button = iframeDoc.createElement('div');
                    button.setAttribute('data-tipped', 'Copy Task Name and URL to Clipboard');
                    button.setAttribute('data-tipped-options', 'showDelay:750');
                    button.classList.add('tipped');
    
                    // styles taken from .harvest-timer.styled
                    button.style.webkitFontSmoothing = 'antialiased';
                    button.style.backgroundImage = 'linear-gradient(#fff,#eee)';
                    button.style.border = '1px solid #bbb';
                    button.style.borderRadius = '2px';
                    button.style.color = '#222';
                    button.style.cursor = 'pointer';
                    button.style.display = 'inline-block';
                    button.style.font = 'inherit';
                    button.style.fontSize = '0';
                    button.style.height = '21px';
                    button.style.lineHeight = '1';
                    button.style.margin = '0';
                    button.style.padding = '1px';
                    button.style.position = 'relative';
                    button.style.verticalAlign = 'top';
                    button.style.width = '21px';
    
                    // styles taken from .harvest-timer.styled.w-harvest-timer
                    button.style.marginRight = '6px';
    
                    // add the clipboard icon
                    button.innerHTML = clipboard;
    
                    // add onclick to the link
                    button.onclick = function() {
                        copyToClip(richTextDiv.innerHTML);
    
                        // set the button background image to show it was clicked
                        button.style.backgroundImage = 'linear-gradient(#f8f8f8,#e8e8e8)';
    
                        // reset the background image quickly
                        setTimeout(function() {
                            button.style.backgroundImage = 'linear-gradient(#fff,#eee)';
                        }, 120);
                    }
    
                    // add the button to the element
                    element.parentElement.prepend(button);
                });
            }
    
        }, 8000);
    }

    init();

    // Create a MutationObserver instance
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                init();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
})();
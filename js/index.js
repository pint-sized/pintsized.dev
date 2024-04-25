document.addEventListener('DOMContentLoaded', init);

/* Routing */
const routes = {
    notfound: {
        template: '/_pages/notfound.html',
        title: '404',
        description: 'Page not found'
    },
    'pint-sized': {
        template: '/_pages/pint-sized.html',
        title: 'Home',
        description:
            'Pint-Sized Softwre: Desktop, Web & Mobile app development.'
    },
    taskbridge: {
        template: '/_pages/taskbridge.html',
        title: 'About Us',
        description:
            'TaskBridge: Synchronise your Apple Notes & Remidners with NextCloud or CalDAV.'
    },
    contact: {
        template: '/_pages/contact.html',
        title: 'Contact Us',
        description: 'Contact Pint-Sized Software.'
    },
    links: {
        template: '/_pages/links.html',
        title: 'Links',
        description: 'Links related to Pint-Sized Software.'
    },
    github: {
        template: '/_pages/github.html',
        title: 'GitHub',
        description: 'Pint-Sized Software GitHub links.'
    }
};

function init() {
    toggleColourMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
    );
    const dockIcons = document.querySelectorAll('.dock img');
    for (icon of dockIcons) {
        icon.addEventListener('click', pageHandler);
    }

    loadInitial();
    window.addEventListener('resize', handleWindowResize);
}

function toggleColourMode(mode) {
    document.documentElement.setAttribute('data-bs-theme', mode);
}

function isLargeViewport() {
    return window.innerWidth >= 1200;
}

function getNextWindowIndex() {
    let zIndex = 0;
    const windows = document.querySelectorAll('.window');
    for (let win of windows) {
        // let z = window.getComputedStyle(win).getPropertyValue('z-index');
        let z = win.style.zIndex;
        if (z == 'auto') {
            z = 0;
            document.getElementById(win.id).style.zIndex = z;
        }
        zIndex = z > zIndex ? z : zIndex;
    }
    return ++zIndex;
}

function handleWindowResize() {
    let zIndex = 0;
    let topWindow = undefined;
    const windows = document.querySelectorAll('.window');

    for (let win of windows) {
        if (win.style.zIndex >= zIndex) {
            topWindow = win;
        }
    }

    if (!isLargeViewport()) {
        // Close all windows except top-most
        for (let win of windows) {
            if (win != topWindow) {
                win.remove();
            }
        }

        // Format top-most window for smaller screens
        topWindow.style.removeProperty('top');
        topWindow.style.removeProperty('left');
        topWindow.style.removeProperty('width');
        topWindow.style.removeProperty('height');
        topWindow.querySelector('.zoom').style.display = 'none';
        const clonedWindow = topWindow.cloneNode(true);
        topWindow.parentNode.replaceChild(clonedWindow, topWindow);

        // Set the active dot for the top window to be the only active one
        const dockIcons = document.querySelectorAll('.dock img');
        for (icon of dockIcons) {
            icon.classList.remove('active');
        }
        const buttonId = topWindow.id.slice(0, -7);
        document.getElementById(buttonId).classList.add('active');
    } else {
        topWindow.querySelector('.zoom').style.display = 'inline-block';
        handleWindow();
    }
}

function loadInitial() {
    let hash = 'pint-sized';
    if (window.location.hash) {
        hash = window.location.hash.substring(1);
    }
    pageHandler(undefined, hash);
}

function dragElement(elmnt) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    document.querySelector('#' + elmnt.id + ' .titlebar').onmousedown =
        dragMouseDown;
    document.querySelector('#' + elmnt.id + ' .titlebar').ontouchstart =
        dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        clientX = e.clientX || e.touches[0].clientX;
        clientY = e.clientY || e.touches[0].clientY;

        e.preventDefault();
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;
        let top = elmnt.offsetTop - pos2;

        let topBoundary = (window.innerHeight * 3) / 100;
        if (top <= topBoundary) {
            top = topBoundary + 0.5;
        }

        let bottomBoundary = window.innerHeight - 25;
        if (top >= bottomBoundary) {
            top = bottomBoundary - 0.5;
        }

        elmnt.style.top = top + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

function focusElement(elmnt) {
    elmnt.addEventListener('mousedown', function increaseIndex() {
        elmnt.style.zIndex = getNextWindowIndex();
    });
}

function handleWindow() {
    const windows = document.querySelectorAll('.window');
    for (let win of windows) {
        dragElement(win);
        focusElement(win);
        document.querySelector('#' + win.id + ' .zoom').style.display =
            'inline-block';
        const zoomButton = document.querySelector(
            '#' + win.id + ' .zoombutton'
        );
        const closeButton = document.querySelector(
            '#' + win.id + ' .closebutton'
        );
        ['click', 'touchstart'].forEach((e) => {
            zoomButton.addEventListener(e, handleZoom);
            closeButton.addEventListener(e, () => {
                const buttonId = win.id.slice(0, -7);
                if (buttonId != 'notfound') {
                    document
                        .getElementById(buttonId)
                        .classList.remove('active');
                }
                win.remove();
            });
        });
    }
}

function handleZoom(evt) {
    const win = evt.target.closest('.window');
    if (win.offsetWidth < window.innerWidth) {
        win.style.left = 0;
        win.style.top = '3dvh';
        win.style.width = '100dvw';
        win.style.height = '84dvh';
    } else {
        win.style.width = '50dvw';
        win.style.height = '70dvh';
        win.style.top = '8dvh';
        win.style.left = '25dvw';
    }
}

function bindWindow(location) {
    if (location == 'contact') {
        bindContactForm();
    }
}

function bindContactForm() {
    const form = document.getElementById('contactForm');
    const url =
        'https://2f3i1gm22c.execute-api.us-east-1.amazonaws.com/dev/email/send';
    const toast = document.getElementById('contact-result');
    const submit = document.getElementById('btn-send');

    function showContactStatus() {
        document.getElementById('btn-send').style.display = 'none';
        document.getElementById('contact-result').style.display = 'block';
    }

    function success() {
        toast.innerHTML = '✅ Your message has been sent.';
        toast.style.backgroundColor = '#1B3330';
        toast.style.color = 'white';
        submit.disabled = false;
        submit.blur();
        form.name.focus();
        form.name.value = '';
        form.email.value = '';
        form.message.value = '';
    }

    function error(err) {
        toast.innerHTML = "😭 Welp! That didn't work.";
        toast.style.color = 'white';
        toast.style.backgroundColor = 'red';
        submit.disabled = false;
        console.log(err);
    }

    function post(url, body, callback) {
        var req = new XMLHttpRequest();
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status < 400) {
                callback(null, JSON.parse(req.responseText));
            } else {
                callback(new Error('Request failed: ' + req.statusText));
            }
        });
        req.send(JSON.stringify(body));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        showContactStatus();
        toast.innerHTML = '⏲️ Sending...';
        toast.style.color = 'black';
        toast.style.backgroundColor = '#feef88';
        const payload = {
            name: form.name.value,
            email: form.email.value,
            content: form.message.value
        };
        post(url, payload, function (err, res) {
            if (err) {
                return error(err);
            }
            success();
        });
    });
}

const pageHandler = async (evt = undefined, hash = undefined) => {
    // Figure out where to go
    let button = document.getElementById('pint-sized');
    if (evt) {
        evt.preventDefault();
        button = evt.target;
    } else if (hash) {
        button = document.getElementById(hash);
    }
    const location = button.id;
    let route = routes[location] || routes['notfound'];

    // Configure active element
    const dockIcons = document.querySelectorAll('.dock img');
    if (!isLargeViewport()) {
        for (icon of dockIcons) {
            icon.classList.remove('active');
        }
    }
    if (!button.classList.contains('active')) {
        button.classList.add('active');
    }

    // If page already on desktop, show it and return
    const windows = document.querySelectorAll('.window');
    for (let win of windows) {
        if (win.id == location + '-window') {
            const z = getNextWindowIndex();
            document.getElementById(location + '-window').style.zIndex = z;
            return;
        }
    }

    // Fetch page
    let html = '';
    try {
        html = await fetch(route.template).then((response) => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Error fetching page.');
        });
    } catch (error) {
        console.log(error);
        route = routes['notfound'];
        html = await fetch(route.template).then((response) => response.text());
    }

    // Set page z-index
    const parser = new DOMParser();
    const page = parser.parseFromString(html, 'text/html');
    let win = page.documentElement.querySelector('.window');
    const z = getNextWindowIndex();
    win.style.zIndex = z;

    // Display the window
    if (isLargeViewport()) {
        document.getElementById('desktop').innerHTML +=
            page.documentElement.innerHTML;
    } else {
        document.getElementById('desktop').innerHTML =
            page.documentElement.innerHTML;
    }

    // Update page meta and URL
    document
        .querySelector('meta[name="description"]')
        .setAttribute('content', route.description);
    history.pushState({}, '', `#${location}`);
    window.scrollTo(0, 0);

    // Handle window management on large viewports
    if (isLargeViewport()) {
        // Set page offset
        if (windows.length > 0) {
            let defaultStyle = window.getComputedStyle(
                document.getElementById(win.id)
            );
            let top = defaultStyle.getPropertyValue('top');
            let left = defaultStyle.getPropertyValue('left');
            top = parseFloat(top.replace('px', ''));
            left = parseFloat(left.replace('px', ''));
            const domEl = document.getElementById(win.id);
            domEl.style.top = top + 30 * windows.length + 'px';
            domEl.style.left = left + 30 * windows.length + 'px';
        }
        handleWindow();
    }

    // Perform any bindings necessary
    bindWindow(location);
};

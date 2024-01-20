document.addEventListener('DOMContentLoaded', function() {
    var tabLinks = document.querySelectorAll('.nav-tab');
    var cursor = document.getElementById('cursor');

    tabLinks.forEach(function(link, index) {
        link.style.setProperty('--index', index);
        link.addEventListener('click', function(event) {
            event.preventDefault();

            // Réinitialise la classe "active" pour tous les onglets
            tabLinks.forEach(function(tab) {
                tab.classList.remove('active');
            });

            // Ajoute la classe "active" à l'onglet sélectionné
            this.classList.add('active');

            // Déplace le curseur en fonction de l'onglet sélectionné
            cursor.style.transform = 'translateX(calc(var(--index) * 100%))';

            // Récupère l'ID de l'onglet
            var tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    function showTab(tabId) {
        var tabs = document.getElementsByClassName("tab");
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].style.display = "none";
        }
        document.getElementById(tabId).style.display = "block";

        // Fetch and display cookies when Tab 2 is opened
        if (tabId === 'tab2') {
            fetchAndDisplayCookies();
        }
    }

    // Function to fetch and display cookies
    function fetchAndDisplayCookies() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var tabUrl = currentTab.url;

            chrome.cookies.getAll({ url: tabUrl }, function(cookies) {
                displayCookies(cookies);
            });
        });
    }

    function displayCookies(cookies) {
        var cookieListContainer = document.getElementById('cookieList');
        if (!cookieListContainer) {
            console.error("Cookie list container not found.");
            return;
        }
    
        // Clear existing content
        cookieListContainer.innerHTML = "";
    
        if (cookies.length === 0) {
            cookieListContainer.innerHTML = "<p>No cookies found.</p>";
            return;
        }
    
        // Create a div for each cookie with 10px margin
        cookies.forEach(function(cookie) {
            var cookieDiv = document.createElement('div');
            cookieDiv.style.marginBottom = '10px'; // 10px margin between cookies
            cookieDiv.style.backgroundColor = '#eee'; // Light gray background
            cookieDiv.style.padding = '10px'; // 10px padding for each cookie
            cookieDiv.style.position = 'relative'; // Make it a positioned element
            cookieDiv.style.cursor = 'pointer'; // Change cursor to pointer
            cookieDiv.style.width = '400px'; // Set width to 100%
            cookieDiv.style.borderRadius = '5px'; // Add border radius
            cookieDiv.style.border = '1px solid #c9286b'; // Add border
    
            // Create and append elements for each cookie property
            var nameElement = document.createElement('p');
            nameElement.textContent = cookie.name;
            nameElement.style.fontWeight = 'bold'; // Set the name to bold
    
            var domainElement = document.createElement('p');
            domainElement.textContent = cookie.domain;
            domainElement.style.position = 'absolute'; // Position the domain in the top right corner
            domainElement.style.top = '5px'; // Adjust top position
            domainElement.style.right = '5px'; // Adjust right position
            domainElement.style.fontSize = '10px'; // Set the font size to make it smaller
    
            var valueElement = document.createElement('p');
            valueElement.textContent = "Value: " + cookie.value;
            valueElement.style.maxHeight = '0'; // Initially hide the value
            valueElement.style.overflow = 'hidden'; // Hide overflow content
            valueElement.style.transition = 'max-height 0.3s ease-in-out'; // Add transition
    
            var detailsContainer = document.createElement('div');
            detailsContainer.style.maxHeight = '0'; // Initially hide details
            detailsContainer.style.overflow = 'hidden'; // Hide overflow content
            detailsContainer.style.transition = 'max-height 0.3s ease-in-out'; // Add transition
            detailsContainer.style.marginTop = '10px'; // Add margin below the value
    
            // Create and append elements for additional cookie details
            var expiresElement = document.createElement('p');
            expiresElement.textContent = "Expires: " + cookie.expires;
    
            var pathElement = document.createElement('p');
            pathElement.textContent = "Path: " + cookie.path;
    
            var secureElement = document.createElement('p');
            secureElement.textContent = "Secure: " + cookie.secure;
    
            var httpOnlyElement = document.createElement('p');
            httpOnlyElement.textContent = "HttpOnly: " + cookie.httpOnly;
    
            // Add click event to toggle visibility of the value and details
            valueElement.addEventListener('click', function() {
                if (valueElement.style.maxHeight === '0px') {
                    valueElement.style.maxHeight = valueElement.scrollHeight + 'px'; // Expand
                    detailsContainer.style.maxHeight = detailsContainer.scrollHeight + 'px'; // Expand details
                } else {
                    valueElement.style.maxHeight = '0'; // Collapse
                    detailsContainer.style.maxHeight = '0'; // Collapse details
                }
            });
    
            // Append elements to the details container
            detailsContainer.appendChild(expiresElement);
            detailsContainer.appendChild(pathElement);
            detailsContainer.appendChild(secureElement);
            detailsContainer.appendChild(httpOnlyElement);
    
            var arrowIcon = document.createElement('img');
            arrowIcon.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/></svg>';
            arrowIcon.style.position = 'absolute';
            arrowIcon.style.bottom = '5px'; // Adjust bottom position
            arrowIcon.style.right = '5px'; // Adjust right position
            arrowIcon.style.cursor = 'pointer'; // Change cursor to pointer
            arrowIcon.style.transition = 'transform 0.3s ease-in-out'; // Add transition for rotation
    
            // Add click event to toggle visibility of the value, details, and rotate arrow icon
            arrowIcon.addEventListener('click', function() {
                if (valueElement.style.maxHeight === '0px') {
                    valueElement.style.maxHeight = valueElement.scrollHeight + 'px'; // Expand value
                    detailsContainer.style.maxHeight = detailsContainer.scrollHeight + 'px'; // Expand details
                    arrowIcon.style.transform = 'rotate(180deg)'; // Rotate arrow vertically
                } else {
                    valueElement.style.maxHeight = '0'; // Collapse value
                    detailsContainer.style.maxHeight = '0'; // Collapse details
                    arrowIcon.style.transform = 'rotate(0deg)'; // Reset rotation
                }
            });
    
            // Append elements to the cookie div
            cookieDiv.appendChild(nameElement);
            cookieDiv.appendChild(domainElement);
            cookieDiv.appendChild(valueElement);
            cookieDiv.appendChild(detailsContainer);
            cookieDiv.appendChild(arrowIcon);
    
            // Append the cookie div to the container
            cookieListContainer.appendChild(cookieDiv);
        });
    }
    

    // Automatically show Tab 1 on extension load
    showTab('tab1');
});

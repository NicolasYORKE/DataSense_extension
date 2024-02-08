document.addEventListener('DOMContentLoaded', function() {

    var links = document.querySelectorAll('.nav-link');

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche le comportement par défaut du lien
            setActive(link);
        });
    });

    function setActive(clickedLink) {
        // Retirer la classe 'active' de tous les liens
        links.forEach(function(link) {
            link.classList.remove('active');
        });

        // Ajouter la classe 'active' à l'élément actuel
        clickedLink.classList.add('active');
    }

    // Onglet 3 - Chatbot
    var chatContainer = document.getElementById('chatContainer');
    var userInput = document.getElementById('userInput');
    var sendButton = document.getElementById('sendButton');

    sendButton.addEventListener('click', function() {
        sendGPTMessage();
    });

    function sendGPTMessage() {
        var userMessage = userInput.value;
        appendMessage('user', userMessage);

        // Remplacez 'YOUR_OPENAI_API_KEY' par votre clé d'API OpenAI
        //const openaiApiKey = require('config.js');

        console.log('Avant la requête à l\'API');

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Ajoutez cette ligne avec le modèle souhaité
                messages: [
                    { role: 'system', content: 'Tu es un assistant dans la gestion des cookies en ligne.' },
                    { role: 'user', content: userMessage }
                ]
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Réponse de l\'API:', data);

            var chatbotReply = data.choices[0].message.content;
            appendMessage('chatbot', chatbotReply);
        })
        .catch(error => {
            console.error('Erreur lors de la requête à l\'API:', error);
        });

        console.log('Après la requête à l\'API');
    }

    function appendMessage(role, content) {
        var messageElement = document.createElement('li');
        messageElement.classList.add(role === 'user' ? 'user-message' : 'chatbot-message');
        messageElement.textContent = content;
        chatContainer.appendChild(messageElement);

        // Effacer le champ de saisie après l'envoi du message
        if (role === 'user') {
            userInput.value = '';
        }
    }


    var tabLinks = document.querySelectorAll('.nav-item');
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
    
            // Ajoutez un gestionnaire d'événements au bouton pour supprimer tous les cookies
            var deleteAllCookiesButton = document.getElementById('deleteAllCookiesButton');
            if (deleteAllCookiesButton) {
                deleteAllCookiesButton.addEventListener('click', function() {
                    deleteAllCookies();
                });
            }
        }
    }

    function deleteAllCookies() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var tabUrl = currentTab.url;
    
            chrome.cookies.getAll({ url: tabUrl }, function(cookies) {
                // Supprime chaque cookie
                cookies.forEach(function(cookie) {
                    deleteCookie(cookie.name, cookie.domain);
                });
    
                // Rafraîchit la liste des cookies après suppression
                fetchAndDisplayCookies();
            });
        });
    }

    function fetchAndDisplayCookies() {
        // Charger la base de données JSON
        fetch('db_cookies.json')
            .then(response => response.json())
            .then(cookiesDatabase => {
                // Récupérer les cookies actuels
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    var currentTab = tabs[0];
                    var tabUrl = currentTab.url;
    
                    chrome.cookies.getAll({ url: tabUrl }, function(cookies) {
                        // Appeler la fonction displayCookies avec les cookies actuels et la base de données
                        displayCookies(cookies, cookiesDatabase);
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la base de données:', error);
            });
    }


    // Function to display cookies
    function displayCookies(cookies, cookiesDatabase) {
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

        // Loop through cookies and create div for each cookie
       // Loop through cookies and create div for each cookie
        cookies.forEach(function(cookie) {
            // Get cookie description from the database
            var description = cookiesDatabase[cookie.name];
            if (!description) {
                description = "No description found for " + cookie.name;
            }

            // Créez et ajoutez les éléments DOM
            var cookieDiv = document.createElement('div');
            cookieDiv.style.marginBottom = '10px';
            cookieDiv.style.backgroundColor = '#eee';
            cookieDiv.style.padding = '10px';
            cookieDiv.style.position = 'relative';
            cookieDiv.style.cursor = 'pointer';
            cookieDiv.style.width = '400px';
            cookieDiv.style.borderRadius = '5px';
            cookieDiv.style.border = '1px solid #c9286b';

            // Create delete icon
            var deleteIcon = document.createElement('img');
            deleteIcon.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M2 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V4H2V3zm2 0V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H4zm9 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-1 1H4v7h9V6z"/></svg>';
            deleteIcon.style.position = 'absolute';
            deleteIcon.style.top = '20px'; // Adjust top position
            deleteIcon.style.right = '5px'; // Adjust right position
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.transition = 'transform 0.3s ease-in-out';

            // Add click event to delete the cookie
            deleteIcon.addEventListener('click', function () {
                deleteCookie(cookie.name, cookie.domain);
                // Remove the corresponding div from the DOM
                cookieDiv.remove();
            });

            // Create arrow icon
            var arrowIcon = document.createElement('img');
            arrowIcon.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/></svg>';
            arrowIcon.style.position = 'absolute';
            arrowIcon.style.bottom = '5px'; // Adjust bottom position
            arrowIcon.style.right = '5px'; // Adjust right position
            arrowIcon.style.cursor = 'pointer';
            arrowIcon.style.transition = 'transform 0.3s ease-in-out';

            // Add click event to toggle visibility of the value, details, and rotate arrow icon
            arrowIcon.addEventListener('click', function () {
                if (valueElement.style.maxHeight === '0px') {
                    valueElement.style.maxHeight = valueElement.scrollHeight + 'px'; // Expand value
                    descElement.style.maxHeight = descElement.scrollHeight + 'px'; // Expand description
                    detailsContainer.style.maxHeight = detailsContainer.scrollHeight + 'px'; // Expand details
                    arrowIcon.style.transform = 'rotate(180deg)'; // Rotate arrow vertically
                } else {
                    valueElement.style.maxHeight = '0'; // Collapse value
                    descElement.style.maxHeight = '0'; // Collapse description
                    detailsContainer.style.maxHeight = '0'; // Collapse details
                    arrowIcon.style.transform = 'rotate(0deg)'; // Reset rotation
                }
            });

            // Create and append elements for each cookie property
            var nameElement = document.createElement('p');
            nameElement.textContent = cookie.name;
            nameElement.style.fontWeight = 'bold';
            nameElement.style.fontFamily = 'Nunito, sans-serif';

            var domainElement = document.createElement('p');
            domainElement.textContent = cookie.domain;
            domainElement.style.position = 'absolute';
            domainElement.style.top = '5px';
            domainElement.style.right = '5px';
            domainElement.style.fontSize = '10px';

            var valueElement = document.createElement('p');

            // Créer une balise <span> pour le texte "Value" en gras
            var valueLabel = document.createElement('span');
            valueLabel.textContent = "Value ";
            valueLabel.style.fontWeight = 'bold';

            // Créer une balise <br> pour passer à la ligne suivante
            var lineBreak = document.createElement('br');

            // Créer le texte de la valeur du cookie
            var cookieValueText = document.createTextNode(cookie.value);

            // Ajouter le label, le saut de ligne et la valeur au paragraphe
            valueElement.appendChild(valueLabel);
            valueElement.appendChild(lineBreak);
            valueElement.appendChild(cookieValueText);

            valueElement.style.maxHeight = '0';
            valueElement.style.overflow = 'hidden';
            valueElement.style.transition = 'max-height 0.3s ease-in-out';
            valueElement.style.fontFamily = 'Nunito, sans-serif';



            var descElement = document.createElement('p');

            // Créer une balise <span> pour le texte "Description" en gras
            var descLabel = document.createElement('span');
            descLabel.textContent = "Description";
            descLabel.style.fontWeight = 'bold';

            // Créer une balise <br> pour passer à la ligne suivante
            var lineBreak = document.createElement('br');

            // Créer le texte de la description
            var descText = document.createTextNode(description);

            // Ajouter le label, le saut de ligne et la description au paragraphe
            descElement.appendChild(descLabel);
            descElement.appendChild(lineBreak);
            descElement.appendChild(descText);

            descElement.style.maxHeight = '0';
            descElement.style.overflow = 'hidden';
            descElement.style.transition = 'max-height 0.3s ease-in-out';
            descElement.style.fontFamily = 'Nunito, sans-serif';


            var detailsContainer = document.createElement('div');
            detailsContainer.style.maxHeight = '0';
            detailsContainer.style.overflow = 'hidden';
            detailsContainer.style.transition = 'max-height 0.3s ease-in-out';
            detailsContainer.style.marginTop = '10px';

            // ... (Existing code for other elements)

            // Append elements to the cookie div
            cookieDiv.appendChild(deleteIcon);
            cookieDiv.appendChild(nameElement);
            cookieDiv.appendChild(domainElement);
            cookieDiv.appendChild(valueElement);
            cookieDiv.appendChild(descElement);
            cookieDiv.appendChild(detailsContainer);
            cookieDiv.appendChild(arrowIcon);

            // Append the cookie div to the container
            cookieListContainer.appendChild(cookieDiv);
        });

    }


    // Function to delete cookie
    function deleteCookie(cookieName) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            var tabUrl = currentTab.url;

            chrome.cookies.remove({
                name: cookieName,
                url: tabUrl
            }, function(deletedCookie) {
                console.log("Deleted cookie:", deletedCookie);
            });
        });
    }



    // Automatically show Tab 1 on extension load
    showTab('tab1');
});

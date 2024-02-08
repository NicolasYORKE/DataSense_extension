// Assurez-vous que cookiesDatabase est défini avec des exemples de données
let cookiesDatabase;

// Chargez le fichier db_cookies.json
fetch(chrome.runtime.getURL('db_cookies.json'))
    .then(response => response.json())
    .then(data => {
        cookiesDatabase = data;
    })
    .catch(error => console.error('Erreur lors du chargement de db_cookies.json:', error));

let notificationCreated = false;

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    // Reset notificationCreated to false
    console.log('onCompleted');
    notificationCreated = false;
    // Fetch all cookies from the page
    chrome.cookies.getAll({ url: details.url }, function(cookies) {
        // Check if notification has been created
        if (!notificationCreated) {
            // Loop through cookies and check if any matches your database
            for (const cookie of cookies) {
                // Get cookie description from the database
                const description = cookiesDatabase[cookie.name];
                if (description) {
                    // Send a Chrome notification
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'assets/Logo_DataSense2.png',
                        title: 'Cookie trouvé',
                        message: `Un cookie nommé "${cookie.name}" avec la description "${description}" a été trouvé!`
                    });

                    // Set notificationCreated to true to avoid creating multiple notifications
                    notificationCreated = true;
                    break;  // Exit the loop since we've already found a matching cookie
                }
            }
        }
    });
});

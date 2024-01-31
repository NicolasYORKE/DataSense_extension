chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkAmazonSite') {
    console.log('checkAmazonSite')
    // Vérifie si l'URL actuelle correspond au site d'Amazon
    if (isAmazonSite(sender.tab.url)) {
        // Déclenche la notification Chrome
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/icon48.jpg',
            title: 'Site de surveillance',
            message: 'Vous êtes sur le site d\'Amazon que nous surveillons!'
        });
    }
  }
});

// Fonction pour vérifier si l'URL correspond au site d'Amazon
function isAmazonSite(url) {
  // Ajoutez ici la logique pour vérifier si l'URL correspond à Amazon
  // Par exemple, vous pouvez vérifier si l'URL contient le domaine amazon.com
  return url.includes('amazon.fr');
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  // Fetch all cookies from the page
  chrome.cookies.getAll({ url: details.url }, function(cookies) {
    // Check if there is a cookie named "session-id"
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-id');
    if (sessionCookie) {
      // Send a Chrome notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon48.jpg',
        title: 'Session ID Cookie',
        message: 'A cookie named "session-id" was found!'
      });
    }
  });
});


/*chrome.cookies.onChanged.addListener(function(changeInfo) {
  // Vérifie si un nouveau cookie a été ajouté
  if (changeInfo.cause === "explicit" && changeInfo.removed === false) {
      // Déclenche la notification Chrome
      chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icon48.jpg',
          title: 'Nouveaux cookies détectés',
          message: 'Des nouveaux cookies ont été ajoutés!'
      });
  }
});*/

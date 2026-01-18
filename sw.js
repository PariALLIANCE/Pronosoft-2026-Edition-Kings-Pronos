const CACHE_NAME = 'kingpronos-v1';

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  
  // Force le nouveau service worker à devenir actif immédiatement
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  
  // Nettoie les anciens caches si nécessaire
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression du cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Prend le contrôle de toutes les pages immédiatement
      return self.clients.claim();
    })
  );
});

// Interception des requêtes - Mode Network First (pas de cache pour les données)
self.addEventListener('fetch', (event) => {
  // Stratégie: Toujours récupérer depuis le réseau
  // Pas de mise en cache pour garantir les données les plus récentes
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Retourne la réponse fraîche du réseau
        return response;
      })
      .catch((error) => {
        // En cas d'erreur réseau, on ne fait rien
        // L'application gérera l'erreur elle-même
        console.log('Service Worker: Erreur réseau pour', event.request.url);
        throw error;
      })
  );
});

// Gestion des messages depuis l'application
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Chargé et prêt (mode network-only)');
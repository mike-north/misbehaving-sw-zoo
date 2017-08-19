const WORKER_VERSION = 2;
const CACHE_NAME = `cache-${WORKER_VERSION}`;

function log() {
  console.log(`[SW${WORKER_VERSION}]`, ...arguments);
}

function wait(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

self.addEventListener('install', installEvt => {
  self.skipWaiting(); // activate immediately after install
  installEvt.waitUntil(
    caches.open(CACHE_NAME).then( cache =>
      cache.add('/delay/check.png')
    ),
    wait(500).then(() => {
      log('Install completed');
    })
  );
});

self.addEventListener('activate', activateEvt => {
  activateEvt.waitUntil(
    caches.keys().then(cacheNames => {
      let toDelete = cacheNames.filter((cn) => cn !== CACHE_NAME);
      if (toDelete.length) log('Deleting caches', toDelete);
      return Promise.all(
        toDelete.map(cn => caches.delete(cn))
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => log('Activate completed'))
  );
});

function fetchImageWithFallback(request) {
  return new Promise((resolve, reject) => {
    // Give up and use the cached version after 2 seconds
    let giveUp = setTimeout(() => {
      log('took too long. Fall back to cached version');
      reject();
    }, 3000);
    fetch(request).then((response) => {
      clearTimeout(giveUp);
      log('fetch completed');
      resolve(response);
    })
  })
  .catch(() => {
    log('Serving up cached version out of cache: ' + CACHE_NAME);
    fetch('http://localhost:3000/delay/check.png?delay=200').then(r => {
      caches.match('/delay/check.png', { cacheName: CACHE_NAME}).then(resp => {
        log('after a second', resp);
      });
    });
    return caches.match('/delay/check.png', { cacheName: CACHE_NAME})
      .then(cacheResponse => {
        log('cacheResponse', cacheResponse);
        return cacheResponse;
      });
  });
}

self.addEventListener('fetch', fetchEvt => {
  let { request } = fetchEvt;
  let acceptHeader = request.headers.get('accept');
  let isCheckImage = acceptHeader.indexOf('image/*') &&
    fetchEvt.request.url.indexOf('check.png') >= 0;
  
  if (isCheckImage)
    fetchEvt.respondWith(
      fetchImageWithFallback(fetchEvt.request)
    )
});
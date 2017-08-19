self.addEventListener('install', activateEvt => self.skipWaiting());

self.addEventListener('fetch', fetchEvt => {
  let { request } = fetchEvt;
  let acceptHeader = request.headers.get('accept');
  let isHtml = acceptHeader.indexOf('text/html');
  if (isHtml) {
    fetchEvt.respondWith(
      new Promise((_, reject) => {
        // this promise will never resolve
      })
    )
  }
});
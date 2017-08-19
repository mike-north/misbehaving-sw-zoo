(function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  setTimeout(() => {
    document.getElementById('container').innerHTML = `<img src="/delay/check.png?delay=5000" height=200>`;
  }, 1000);
}())
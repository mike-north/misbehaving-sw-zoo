# Mishandling of fetch event for initial navigation

## Summary

Mishandling of the fetch event for initial navigation can put the user's browser into a state where they cannot complete the initial navigation event. 

## Negative impacts on the user
* User is prevented from completing the request to load the single-page app
* User is prevented from receiving bug fixes and other updates

## Instructions to reproduce

* Start up this example by running `npm start --- html-noresolve`
* Visit http://localhost:3000 (the service worker will not yet be involved in rendering this HTML)
* Change something in /examples/html-noresolve/views/index.html and refresh the browser
> **you will now be in a broken state, where the original navigation event is still pending, and you're seeing old HTML**

* Change something in the service worker (i.e., comment out everything except the install event handler on line 1)
> **you'll still be in the broken state, because the "fixed" service worker will be unable to push the broken one out of operation. It's sitll being allowed to complete handlign this fetch event, which will never complete**

## Variants

* Mis-configuring CORS headers, running into a TLS error, or otherwise causing `fetch` to fail while handling this navigation event
* When handling this fetch event, passing a promise that will reject, hang, or otherwise fail to resolve into the `fetchEvent.respondWith` function

## Notes

* Unless developers have a "preserve log" setting on, this failure can be very difficult to detect, because the log starts after the navigation event completes
* Depending on various other circumstances, the browser may sometimes be able to consider its self "arrived" at the domain on which the app is hosted, making the process of identifying and unregistering the rogue service worker significantly more subtle and complicated.
* Popular implementations of a "kill switch", which involve a "bare bones" service worker using `self.skipWaiting()`
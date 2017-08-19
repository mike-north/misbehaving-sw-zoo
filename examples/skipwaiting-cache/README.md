# Using `skipWaiting` in combination with a popular cache cleanup causes a race condition and potential fetch failures

## Summary

Service Workers that employ `self.skipWaiting()` in order to take control of clients as quickly as possible can cause a race condition, resulting in unexpected cache misses

## Negative impacts on the user
* fetch requests that involve reading the cache may fail unexpectedly, during a service worker upgrade 

## Instructions to reproduce

* Start up this example by running `npm start --- skipwaiting-cache`
* Visit http://localhost:3000 (the service worker will not yet be involved in rendering this HTML)

## Variants

## Notes
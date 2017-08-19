var path = require('path');
var express = require('express');
var app = express();

const EXERCISE_NAME = process.argv[2];
const EXAMPLE_ROOT = path.join(__dirname, 'examples', EXERCISE_NAME);
const PUBLIC_ROOT = path.join(EXAMPLE_ROOT, 'public');

console.log('public root', PUBLIC_ROOT);

app.get("/delay/check.png", function (request, response) {
  let delay = request.query.delay || 0;
  setTimeout(() => {
    response.sendFile(path.join(__dirname, 'public', 'check.png'));
  }, delay);
});

app.use(express.static(PUBLIC_ROOT));

app.get("/", function (request, response) {
  response.sendFile(`${EXAMPLE_ROOT}/views/index.html`);
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on http://localhost:' + listener.address().port);
});

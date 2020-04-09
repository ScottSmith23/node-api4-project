const server = require('./server.js');

server.listen(3333, () => {
  console.log('\n* Server Running on http://localhost:3333 *\n');
});
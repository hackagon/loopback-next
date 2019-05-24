// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeting-app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = require('./dist');

async function runApp() {
  const app = new module.exports.GreetingApplication({
    rest: {host: '127.0.0.1', port: 3000},
  });
  await app.main();
  console.log(`The service is running at ${app.restServer.url}/greet/world`);
}

if (require.main === module) {
  runApp();
}

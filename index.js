require('colors');
const express = require('express');
const Config = require('./src/config');
const Bot = require('./src/bot');
const initLogger = require('./src/logger');
const { readLines, displayHeader } = require('./src/utils');

const app = express();
const PORT = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

async function main() {
  displayHeader();
  console.log('⏳ Please wait...\n'.yellow);

  const config = new Config();
  const logger = initLogger();

  // Read tokens from token.txt
  const tokens = await readLines('token.txt');

  // Check if there is at least one token
  if (tokens.length === 0) {
    console.log('❌ No tokens found in token.txt'.red);
    return;
  }

  const bot = new Bot(config, logger);

  // Connect using the first token without proxies
  const singleToken = tokens[0];
  bot
    .connect(singleToken)
    .catch((err) => console.log(`❌ ${err.message}`.red));

  // HTTP route to serve a dummy response
  app.get('/', (req, res) => {
    res.send('<h1>Service Running</h1><p>This service is operational but does not expect traffic.</p>');
  });

  // Start the HTTP server to satisfy Render's requirement
  app.listen(PORT, () => {
    console.log(`🌐 Dummy server running on port ${PORT}`.green);
  });

  // Gracefully handle shutdown
  process.on('SIGINT', () => {
    console.log(`\n👋 ${'Shutting down...'.green}`);
    process.exit(0);
  });
}

// Run the main function initially
main().catch((error) => console.log(`❌ ${error.message}`.red));

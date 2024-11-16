require('colors');
const express = require('express');
const Config = require('./src/config');
const Bot = require('./src/bot');
const initLogger = require('./src/logger');
const { readLines, displayHeader } = require('./src/utils');

const app = express();
const PORT = 3000; // The port to open for the web server

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

  // HTTP route to serve a simple webpage
  app.get('/', (req, res) => {
    res.send('<h1>Simple Webpage</h1><p>Bot is running...</p>');
  });

  // Start the HTTP server
  app.listen(PORT, () => {
    console.log(`🌐 Web server running on http://localhost:${PORT}`.green);
  });

  // Gracefully handle shutdown
  process.on('SIGINT', () => {
    console.log(`\n👋 ${'Shutting down...'.green}`);
    process.exit(0);
  });
}

main().catch((error) => console.log(`❌ ${error.message}`.red));

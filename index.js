require('colors');
const express = require('express');
const Config = require('./src/config');
const Bot = require('./src/bot');
const initLogger = require('./src/logger');
const { readLines, displayHeader } = require('./src/utils');

const app = express();
const PORT = 3000; // The port to open for the web server
const COOLDOWN_PERIOD = 30 * 60 * 1000; // 30 minutes in milliseconds

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

  // Auto-restart function with a countdown timer
  function autoRestart() {
    let remainingTime = COOLDOWN_PERIOD;

    // Function to update the remaining time every second
    const interval = setInterval(() => {
      const minutes = Math.floor(remainingTime / (60 * 1000));
      const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`⏳ Auto-restart in: ${minutes}m ${seconds}s`);

      remainingTime -= 1000; // Decrease by 1 second

      if (remainingTime <= 0) {
        clearInterval(interval); // Stop the countdown when time is up
        console.log('\n🔄 Auto-restart triggered after 30 minutes cooldown.'.yellow);
        console.log('⏳ Restarting bot and server...');
        main().catch((error) => console.log(`❌ ${error.message}`.red));
      }
    }, 1000); // Update every second
  }

  // Trigger auto-restart with a countdown
  autoRestart();
}

// Run the main function initially
main().catch((error) => console.log(`❌ ${error.message}`.red));

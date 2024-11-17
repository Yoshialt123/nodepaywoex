require('colors');
const express = require('express');
const Config = require('./src/config');
const Bot = require('./src/bot');
const initLogger = require('./src/logger');
const { readLines, displayHeader } = require('./src/utils');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's PORT environment variable or default to 3000
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

  // HTTP route to serve a dummy response
  app.get('/', (req, res) => {
    res.send('<h1>Service Running</h1><p>This service is operational but does not expect traffic.</p>');
  });

  // Start the HTTP server
  app.listen(PORT, () => {
    console.log(`🌐 Dummy server running on port ${PORT}`.green);
  });

  // Gracefully handle shutdown
  process.on('SIGINT', () => {
    console.log(`\n👋 ${'Shutting down...'.green}`);
    process.exit(0);
  });

  // Auto-restart function
  function autoRestart() {
    let remainingTime = COOLDOWN_PERIOD;

    // Countdown without printing the timer
    const interval = setInterval(() => {
      remainingTime -= 1000; // Decrease by 1 second

      if (remainingTime <= 0) {
        clearInterval(interval); // Stop the countdown when time is up
        console.log('\n🔄 Auto-restart triggered after 30 minutes cooldown.'.yellow);
        console.log('⏳ Restarting bot and server...');
        main().catch((error) => console.log(`❌ ${error.message}`.red));
      }
    }, 1000); // Update every second
  }

  // Trigger auto-restart
  autoRestart();
}

// Run the main function initially
main().catch((error) => console.log(`❌ ${error.message}`.red));

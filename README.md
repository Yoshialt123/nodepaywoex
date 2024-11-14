## A bot for running Nodepay on android devices without browser or extension.

---

# Requirements

1. **Node.js**
2. **npm** (Node package manager)

---

## Configuration for Termux

**Install nodejs-lts in Termux**
```
pkg update && pkg upgrade -y
```
```
pkg install nodejs-lts
```
**Install git and nano**
```
pkg install git
pkg install nano
```

**Clone the repository:**

```bash
git clone https://github.com/ashtrobe/nodepaywoex.git
```
**Change directory:**
```
cd nodepaywoex
```

**Install the dependencies:**

```bash
npm install
```

---

## Before running the bot, you need to put your token inside token.txt file.

**To get your Bearer token:**

- Download and install kiwi browser in your phone.
- Go to Nodepay dashboard.
- Open Developer Tools in kiwi browser.

- Go to the **Console** tab in Developer Tools.

- Type the following command to get your token:
  ```bash
  localStorage.getItem('np_webapp_token')
  ```

- This will return the Bearer token. ex: eyJhbGciOi.......

**Paste the token in `token.txt`**:
```
nano token.txt
```
## Running the Bot

**To start the bot, run the following command:**

```bash
npm start
```
Logs are stored in `bot.log` and can also be seen in the console.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Nextcloud Talk node.js Bot (2025)

*RU*

Это бот, соответствующий последнему [Nextcloud API](https://nextcloud-talk.readthedocs.io/en/latest/) для использования в Talks. Я планирую его поддерживать и добавлять новый функционал.

### Требования:

Для работы требуется только **Node.js** и **Nextcloud** последних версий (на старых версиях не тестировал).

### Установка:

```bash
git clone https://github.com/твои-ник/твой-репо.git 

cd твой-репо npm install 

cp .env.example .env 

# Настройте .env файл... 

node index.js
```

### Использование:

Пользовательские файлы следует размещать в **__src/features.js__** , утилиты в **__src/utils/functions.js__**

```javascript
bot.command() - регистрирует новую команду, реагирует
на command_prefix + название команды, например !start.
Каждое последующее слово в строке через пробел является аргументом.
[args]

bot.hears() - регистрирует обработчик текста, реагирует на текст,
полученный от пользователя, например "привет".

bot.use() - создаёт middleware-функцию, которая будет срабатывать
на каждое сообщение, полученное ботом.
```

```javascript
При обработке сообщения у каждого метода есть аргумент 
ctx - контекст.
При помощи него можно отправить ответ пользователю ctx.reply() или
просто сообщение ctx.send().
```

---

*EN*

This is a bot compliant with the latest [Nextcloud API](https://nextcloud-talk.readthedocs.io/en/latest/) for use in Talk conversations. I plan to maintain this project and add new features regularly.

### Requirements:

Requires **Node.js** and the latest versions of **Nextcloud** (has not been tested on legacy versions).

### Installation:

```bash
git clone https://github.com/your-username/your-repo.git 

cd your-repo 

npm install 

cp .env.example .env 

# Configure your .env file... 

node index.js
```

### Usage:

Place your custom logic in **__src/features.js__** and utility functions in **__src/utils/functions.js__**.

```javascript
bot.command() // Registers a new command. Reacts to 
              // command_prefix + command name (e.g., !start). 
              // Each subsequent word in the string is passed as an argument [args].

bot.hears()   // Registers a text handler. Reacts to specific 
              // text received from the user (e.g., "hello").

bot.use()     // Creates a middleware function that triggers 
              // for every message received by the bot.
```

```javascript
// When processing a message, each method provides a 
// ctx (context) argument.
// Use it to reply to a user with ctx.reply() or 
// send a simple message with ctx.send().
```
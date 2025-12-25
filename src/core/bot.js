let logger = require('./logger');
let client = require('./client').default;
let tools = require('../utils/functions');
let config = require('../config/index');

class Conversation {
    constructor (data, botInstance) {
        this.bot = botInstance;
        this.data = data;
        this.token = data.token;
        this.lastKnownMessageId = data.lastMessage ? data.lastMessage.id : 0;

        this.pollChat(this.token);
    };

    async pollChat (token) {
        logger.log(`[${token}] Tracking with ID: ${this.lastKnownMessageId}`);
        while (true) {
            try {
                let response = await client.get(`/ocs/v2.php/apps/spreed/api/v1/chat/${token}`, {
                    params: {
                        'lookIntoFuture': 1,
                        'timeout': 30,
                        'lastKnownMessageId': this.lastKnownMessageId
                    },
                    timeout: 40000
                });

                const data = response.data.ocs.data;
                
                if (data.length > 0) {
                    for (const msg of data) {
                        logger.log(`[${token}] 📩 New message from ${msg.actorDisplayName}: ${msg.message}`);
                        
                        await this.bot.processNewMessage(msg, token);

                        if (msg.id > this.lastKnownMessageId) {
                            this.lastKnownMessageId = msg.id;
                        }
                    }
                } 
            } catch (error) {
                if (error.response && error.response.status === 304) {
                    continue; 
                }

                logger.error(`[${token}] Network error:`, error.message);
                
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}

class NextcloudTalkBot {
    constructor (data) {
        this.commands = {};
        this.textHandlers = [];
        this.middlewares = [];
        this.chatTokens = new Set();
        
        this.initialize(data.server, data.auth);
    };

    async initialize(server, auth) {
        console.log('Starting bot...');

        let conversations = await tools.getOpenedConversations(server, auth)
        this.conversations = tools.getOneOnOneConversations(conversations);

        this.conversations.forEach(element => {
            new Conversation (element, this);
        });
    };

    use(fn) {
        this.middlewares.push(fn);
    };

    command(commandName, handler) {
        const cleanName = commandName.replace(config.commandPrefix, '');
        this.commands[cleanName] = handler;
        logger.log(`✅ Command /${cleanName} has been registered`);
    };

    hears(trigger, handler) {
        this.textHandlers.push({ trigger, handler });
    };
    
    processNewMessage = async function (msgData, token) {
        let ctx = {
            message: msgData,
            text: msgData.message.trim(),
            actor: msgData.actorDisplayName,
            token: token,

            reply: async (text) => {
                try {
                    let response = await client.post(`/ocs/v2.php/apps/spreed/api/v1/chat/${token}`, {
                        message: text,
                        replyTo: msgData.id
                    });

                    if (response.status === 200) {
                        logger.log('Reply has been sent!');
                    }
                } catch (e) {
                    logger.error(`Sending reply error: ${e.message}`);
                }
            },

            send: async (text) => {
                try {
                    let response = await client.post(`/ocs/v2.php/apps/spreed/api/v1/chat/${token}`, {
                        message: text,
                    });

                    if (response.status === 200) {
                        logger.log('Message has been sent!');
                    }
                } catch (e) {
                    logger.error(`Sending message error: ${e.message}`);
                }
            }
        }

        let index = 0;
        let middlewares = this.middlewares;

        let next = async () => {
            if (index < middlewares.length) {
                let middleware = middlewares[index++];

                await middleware(ctx, next);
            } else {
                await this.matchCommands(ctx);
            }
        };

        await next();
    };

    matchCommands = async function (ctx) {
        let text = ctx.text;

        if (text.startsWith('!')) {
            const args = text.slice(1).split(' ');
            const cmd = args.shift().toLowerCase();
            if (this.commands[cmd]) {
                ctx.args = args;
                await this.commands[cmd](ctx);
                return;
            }
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        for (const textHandler of this.textHandlers) {
            let trigger = textHandler.trigger;
            let safeTrigger = escapeRegExp(trigger);
            let regex = new RegExp(`\\b${safeTrigger}\\b`, 'i');
            
            if (regex.test(text)) {
                await textHandler.handler(ctx);
                return;
            }
        }
    };
}

module.exports = NextcloudTalkBot;
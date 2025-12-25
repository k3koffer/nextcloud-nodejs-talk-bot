const fs = require('fs');
const path = require('path');
const NextcloudTalkBot = require('./core/bot');
const config = require('./config/index');

const bot = new NextcloudTalkBot({ server: config.server, auth: config.authString });

const featuresPath = path.join(__dirname, 'features');
const featureFiles = fs.readdirSync(featuresPath).filter(f => f.endsWith('.js'));

console.log('📦 Loading modules...');

for (const file of featureFiles) {
    const setupFeature = require(path.join(featuresPath, file));
    
    setupFeature(bot);
    
    console.log(`🔹 ${file} loaded`);
}

console.log('✅ Bot is ready to work!');
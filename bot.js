require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');

console.log('The bot is starting...');

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60*1000, 
    api_url: 'https://mstdn.social/api/v1/', 
  })

function toot() {    
    const num = Math.floor(Math.random() * 100);
    const params = {
        status: `the meaning of life is ${num}`
    }

    M.post('statuses', params, (error, data) =>{
        if(error){
            console.error(error);
        }else{
            //console.log(data);
            //fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
            console.log(`ID: ${data.id} and timestamp: ${data.created_at}`);
            console.log(data.content);
        }
    })
} 

toot();
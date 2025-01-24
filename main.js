const fs = require('fs');
const Mastodon = require('mastodon-api');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60*1000, 
    api_url: 'https://mstdn.social/api/v1/', 
  })

function deets() {
    M.get('https://mstdn.social/api/v1/timelines/home', {}).then(resp => 
        fs.writeFileSync('raw data/home_data.json', JSON.stringify(resp.data, null, 2))
    )
    console.log('Data fetched');
}

function makewall() {
    const dataPath = path.join(__dirname, 'raw data/home_data.json');
    const output_wall = path.join(__dirname, 'output_wall.html');

    let timelineHtml = '';

    try {
        const homeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        homeData.forEach(post => {
            timelineHtml += `
                <div class="post">
                    <div class="post-header">
                        <img src="${post.account.avatar}" class="avatar" alt="Avatar">
                        <div class="post-user">
                            <p class="username">@${post.account.username}</p>
                            <p class="timestamp">${new Date(post.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-footer">
                        <a href="${post.url}" target="_blank">View Post</a>
                        <span>🔁 ${post.reblogs_count}</span>
                        <span>❤️ ${post.favourites_count}</span>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error reading or parsing home_data.json:', error);
    }

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mastodon Home</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #1c1c1e;
                color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #28282b;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                padding: 20px;
            }
            h1 {
                text-align: center;
                color: #1da1f2;
            }
            .post {
                border-bottom: 1px solid #444;
                padding: 15px 0;
            }
            .post-header {
                display: flex;
                align-items: center;
            }
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }
            .post-user {
                flex-grow: 1;
            }
            .username {
                font-weight: bold;
                margin: 0;
            }
            .timestamp {
                font-size: 0.8em;
                color: #aaa;
                margin: 0;
            }
            .post-content {
                margin: 10px 0;
                font-size: 1.2em;
            }
            .post-footer {
                display: flex;
                justify-content: space-between;
                font-size: 0.9em;
                color: #aaa;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>Home Feed</h1>
        <div id="timeline">${timelineHtml}</div>
    </div>
    </body>
    </html>
    `;

    fs.writeFileSync(output_wall, htmlTemplate, 'utf8');
    console.log('Wall created');
    exec(`start ${output_wall}`);
}

deets();
makewall();


# Discord Chat Replica

A small microservice to generate a Discord-like chat section.

## installation

 - git clone
 - npm i
 - npm run build-jsx
 - create config.json
 - pm2 start pm2.json

## request format

```json
{
  "channel_name": "emma-is-cute",
  "users": {
    "1337": {
      "avatar": "https://weeb.services/assets/avatars/ZPhAsM9w3NA.png",
      "username": "Shana",
      "discriminator": "6969",
      "staff": false
    },
    "6969": {
      "avatar": "https://weeb.services/assets/avatars/rtzoj7LMmW4.png",
      "username": "Noire",
      "discriminator": "1337",
      "staff": true
    }
  },
  "messages": [
    {
      "author": "1337",
      "time": 1576091429571,
      "content": [ "message 1", "message 2", "message *with* stupid **markdown**" ]
    }, {
      "author": "6969",
      "time": 1576091466245,
      "content": [ "yes", "__but actually__", "emma is ***cute***" ]
    }
  ]
}
```

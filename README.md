# Discord Chat Replica
A small microservice to generate a Discord-like chat section.

## installation
~~you dont~~

 - https://github.com/evanw/esbuild#install
 - git clone
 - pnpm i
 - pnpm run build
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
      "badge": null
    },
    "6969": {
      "avatar": "https://weeb.services/assets/avatars/rtzoj7LMmW4.png",
      "username": "Noire",
      "discriminator": "1337",
      "badge": "Staff"
    }
  },
  "messages": [
    {
      "author": "1337",
      "time": 1576091429571,
      "content": [
        {
          "msg": "message 1"
        },
        {
          "msg": "message 2"
        },
        {
          "msg": "message *with* stupid **markdown**"
        }
      ]
    },
    {
      "author": "6969",
      "time": 1576091466245,
      "content": [
        {
          "msg": "yes"
        },
        {
          "msg": "__but actually__"
        },
        {
          "msg": "emma is ***cute***"
        },
        {
          "msg": "here is a file",
          "attachments": [
            {
              "url": "https://example.com/test.zip",
              "size": 133769
            }
          ]
        }
      ]
    }
  ]
}
```

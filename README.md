# X-Hub-Signature check

A function to check the integrity of a body payload against it's x-hub-signature header for a given shared secret. Used by [Facebook Messenger Webhook POST requests](https://developers.facebook.com/docs/messenger-platform/webhook-reference#security)

## Usage

### With express.js

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import { apiEndpoint } from 'calamarble-xhub';

const expressConfig = {
    port: 8088,
    postPath: '/fbwebhook',
    messages: {
        serverRunning: port => `Server running on port ${port}`
    }
};
const xHubConfig = {
    xHubAlgo: 'sha1',
    xHubSecret: 'MY_APP_SECRET',
    messages: {
        wrongSignature: 'Content signature don\'t match'
    }
};
const config = Object.assign({}, expressConfig, xHubConfig);
const app = express();
const postEndPoint = apiEndpoint(config);
app.use(bodyParser.raw({ type: 'application/json' }));
app.post(config.postPath, postEndPoint);
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

```

### With claudia-api-builder

```javascript
import ApiBuilder from 'claudia-api-builder';
import { apiEndpoint as webhookPost} from 'calamarble-xhub';

const api = new ApiBuilder();
const config = {
    xHubAlgo: 'sha1',
    xHubSecret: 'MY_APP_SECRET',
    messages: {
        wrongSignature: 'Content signature don\'t match'
    }
}

api.post('/fbwebhook', webhookPost(config));

export { api as default };
```

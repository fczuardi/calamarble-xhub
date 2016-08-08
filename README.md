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
    algo: 'sha1',
    secret: 'MY_APP_SECRET',
    messages: {
        wrongSignature: 'Content signature don\'t match'
    }
};
const app = express();
const postEndPoint = apiEndpoint(xHubConfig);
app.use(bodyParser.raw({ type: 'application/json' }));
app.post(expressConfig.postPath, postEndPoint);
app.listen(expressConfig.port, () => console.log(`Server running on port ${expressConfig.port}`));

```

### With claudia-api-builder

```javascript
import ApiBuilder from 'claudia-api-builder';
import { apiEndpoint as webhookPost} from 'calamarble-xhub';

const api = new ApiBuilder();
const xHubConfig = {
    algo: 'sha1',
    secret: 'MY_APP_SECRET',
    messages: {
        wrongSignature: 'Content signature don\'t match'
    }
}

api.post('/fbwebhook', webhookPost(xHubConfig));

export { api as default };
```

### With claudia-api-builder and a callback

```javascript
import ApiBuilder from 'claudia-api-builder';
import { apiEndpoint as webhookPost} from 'calamarble-xhub';

const api = new ApiBuilder();
const myCallback = (req, res) => {
    return { foo: 'bar' };
}
const xHubConfig = {
    algo: 'sha1',
    secret: 'MY_APP_SECRET',
    messages: {
        wrongSignature: 'Content signature don\'t match'
    },
    next: myCallback
}


api.post('/fbwebhook', webhookPost(xHubConfig));

export { api as default };
```

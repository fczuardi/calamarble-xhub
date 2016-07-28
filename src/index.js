import crypto from 'crypto';


const signSha1 = (secret, msg) =>
    crypto.createHmac('sha1', secret).update(msg).digest('hex');

const apiEndpoint = config => (req, res) => {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const xHubSignature = req.headers['X-Hub-Signature'];
    let serverSignature;
    try {
        serverSignature = signSha1(config.xHubSecret, rawBody);
    } catch (e) {
        serverSignature = e.message;
    }
    const result = {
        ...req.headers,
        'my-debug-header': serverSignature
    };
    console.log('serverSignature:', serverSignature);
    console.log('X-Hub-Signature', xHubSignature);
    return res ? res.send(result) : result;
};

export {
    apiEndpoint
};

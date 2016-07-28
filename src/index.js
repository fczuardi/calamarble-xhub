import crypto from 'crypto';

const defaultConfig = {
    xHubAlgo: 'sha1',
    xHubSecret: '',
    messages: {
        wrongSignature: 'X-Hub-Signatures do not match.'
    }
}

const signature = (algo, secret, msg) =>
    crypto.createHmac(algo, secret).update(msg).digest('hex');

const apiEndpoint = userConfig => (req, res) => {
    const config = {
        ...defaultConfig,
        userConfig
    };
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const xHubSignature = req.headers['X-Hub-Signature'];
    const serverSignature = signature(config.xHubAlgo, config.xHubSecret, rawBody);
    const result = {
        ...req.headers,
        'my-debug-header': serverSignature
    };
    const signatureMatches = xHubSignature.split('=')[1] === serverSignature;
    console.log('serverSignature:', serverSignature);
    console.log('X-Hub-Signature', xHubSignature);
    console.log('rawBody', rawBody);
    if (!signatureMatches) {
        console.error(config.messages.wrongSignature);
        throw config.messages.wrongSignature;
    }
    return res ? res.send(result) : result;
};

export {
    apiEndpoint
};

import crypto from 'crypto';
import timingSafeCompare from 'tsscmp';

const defaultConfig = {
    xHubAlgo: 'sha1',
    xHubSecret: '',
    messages: {
        wrongSignature: 'X-Hub-Signatures do not match.'
    }
};

const verifySignature = (algo, secret, providedSignature, msg) => {
    const signature = crypto.createHmac(algo, secret).update(msg).digest('hex');
    return timingSafeCompare(
        signature,
        providedSignature
    );
};

const apiEndpoint = userConfig => (req, res) => {
    const config = {
        ...defaultConfig,
        ...userConfig
    };
    const rawBody = req.rawBody || req.body;
    const headers = req.headers;
    const xHubSignature = headers['X-Hub-Signature'] || headers['x-hub-signature'];
    const headerSignature = xHubSignature.split('=')[1];
    const signatureMatches = verifySignature(
        config.xHubAlgo, config.xHubSecret, headerSignature, rawBody
    );
    // console.log('serverSignature:', serverSignature);
    // console.log('X-Hub-Signature', xHubSignature);
    // console.log('rawBody', rawBody);
    if (!signatureMatches) {
        console.error(config.messages.wrongSignature);
        throw config.messages.wrongSignature;
    }
    const result = { success: true };
    return res ? res.send(result) : result;
};

export {
    apiEndpoint
};

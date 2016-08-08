import crypto from 'crypto';
import timingSafeCompare from 'tsscmp';

const defaultXHubConfig = {
    algo: 'sha1',
    secret: '',
    next: null,
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

const signatureMatches = (config, req) => {
    const rawBody = req.rawBody || req.body;
    const headers = req.headers;
    const xHubSignature = headers['X-Hub-Signature'] || headers['x-hub-signature'];
    const headerSignature = xHubSignature.split('=')[1];
    return verifySignature(
        config.algo, config.secret, headerSignature, rawBody
    );
};

const apiEndpoint = userConfig => (req, res) => {
    const config = {
        ...defaultXHubConfig,
        ...userConfig
    };
    if (!signatureMatches(config, req)) {
        console.error(config.messages.wrongSignature);
        throw config.messages.wrongSignature;
    }
    if (!config.cb) {
        const result = { success: true };
        return res ? res.send(result) : result;
    }
    return config.next(req, res);
};

export {
    apiEndpoint
};
